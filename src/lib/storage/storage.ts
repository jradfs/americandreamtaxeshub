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

      return data;
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
