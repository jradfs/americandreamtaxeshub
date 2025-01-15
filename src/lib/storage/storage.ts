import { supabaseBrowserClient } from '@/lib/supabaseBrowserClient';

export class StorageService {
  static readonly BUCKET_NAME = 'documents';

  static async initializeBucket() {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabaseBrowserClient.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === StorageService.BUCKET_NAME);

      if (!bucketExists) {
        // Create bucket if it doesn't exist
        await supabaseBrowserClient.storage.createBucket(StorageService.BUCKET_NAME, {
          public: false,
          fileSizeLimit: 52428800, // 50MB
        });
      }
    } catch (error) {
      console.error('Error initializing storage bucket:', error);
      throw error;
    }
  }

  static async uploadFile(file: File, path: string) {
    try {
      const { data, error } = await supabaseBrowserClient.storage
        .from(StorageService.BUCKET_NAME)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  static async getFileUrl(path: string) {
    try {
      const { data } = supabaseBrowserClient.storage
        .from(StorageService.BUCKET_NAME)
        .getPublicUrl(path);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }
}
