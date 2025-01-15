declare module '@/lib/storage' {
  import { SupabaseClient } from '@supabase/supabase-js';
  
  export const storageClient: SupabaseClient;
  
  export interface StorageUploadResult {
    filePath: string;
    error?: Error;
  }
  
  export function uploadFileToStorage(file: File): Promise<StorageUploadResult>;
}
