import { getSupabase } from '@/lib/supabase/client';
import { type FileObject } from '@supabase/storage-js';

export class StorageService {
  private static BUCKET_NAME = 'tax-documents';
  private static instance: StorageService;
  private initialized = false;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private async initialize() {
    if (this.initialized) return;
    
    try {
      const supabase = getSupabase();
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error initializing storage:', error);
        throw error;
      }

      if (!buckets.find(b => b.name === StorageService.BUCKET_NAME)) {
        const { error: createError } = await supabase.storage.createBucket(
          StorageService.BUCKET_NAME,
          { public: false }
        );
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          throw createError;
        }
      }

      this.initialized = true;
    } catch (error) {
      console.error('Storage initialization failed:', error);
      throw error;
    }
  }

  async uploadFile(file: File, path: string): Promise<FileObject | null> {
    try {
      await this.initialize();
      const supabase = getSupabase();
      const { data: userData } = await supabase.auth.getUser()

      const { data, error } = await supabase.storage
        .from(StorageService.BUCKET_NAME)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        if (error.message?.includes('storage is not allowed')) {
          console.warn('Storage access not allowed:', error);
          return null;
        }
        throw error;
      }

      // If data is just a path, fetch the full file details
      if (data && typeof data === 'object' && 'path' in data) {
        const { data: fileDetails, error: detailsError } = await supabase.storage
          .from(StorageService.BUCKET_NAME)
          .list(path.split('/').slice(0, -1).join('/'), { 
            search: path.split('/').pop() 
          });

        if (detailsError) {
          console.warn('Could not fetch file details:', detailsError);
          return {
            name: file.name,
            bucket_id: StorageService.BUCKET_NAME,
            owner: userData.user?.id || '',
            id: path,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            last_accessed_at: new Date().toISOString(),
            metadata: {},
            path: path
          };
        }

        const matchedFile = fileDetails.find(f => f.name === path.split('/').pop());
        
        return {
          name: matchedFile?.name || file.name,
          bucket_id: StorageService.BUCKET_NAME,
          owner: userData.user?.id || '',
          id: path,
          updated_at: matchedFile?.updated_at || new Date().toISOString(),
          created_at: matchedFile?.created_at || new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          metadata: matchedFile?.metadata || {},
          path: path
        };
      }

      return null;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      return null;
    }
  }

  async downloadFile(path: string): Promise<Blob | null> {
    try {
      await this.initialize();
      const supabase = getSupabase();
      const { data, error } = await supabase.storage
        .from(StorageService.BUCKET_NAME)
        .download(path);

      if (error) {
        if (error.message?.includes('storage is not allowed')) {
          console.warn('Storage access not allowed:', error);
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in downloadFile:', error);
      return null;
    }
  }

  async deleteFile(path: string): Promise<boolean> {
    try {
      await this.initialize();
      const supabase = getSupabase();
      const { error } = await supabase.storage
        .from(StorageService.BUCKET_NAME)
        .remove([path]);

      if (error) {
        if (error.message?.includes('storage is not allowed')) {
          console.warn('Storage access not allowed:', error);
          return false;
        }
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteFile:', error);
      return false;
    }
  }

  async listFiles(prefix?: string): Promise<FileObject[] | null> {
    try {
      await this.initialize();
      const supabase = getSupabase();
      const { data, error } = await supabase.storage
        .from(StorageService.BUCKET_NAME)
        .list(prefix || '');

      if (error) {
        if (error.message?.includes('storage is not allowed')) {
          console.warn('Storage access not allowed:', error);
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in listFiles:', error);
      return null;
    }
  }

  getPublicUrl(path: string): string | null {
    try {
      const supabase = getSupabase();
      const { data } = supabase.storage
        .from(StorageService.BUCKET_NAME)
        .getPublicUrl(path);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in getPublicUrl:', error);
      return null;
    }
  }
}
