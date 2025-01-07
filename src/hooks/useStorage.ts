import { useState } from 'react';
import { StorageService } from '@/lib/storage/storage';
import { type FileObject } from '@supabase/storage-js';

interface UseStorageReturn {
  uploadFile: (file: File, path: string) => Promise<FileObject | null>;
  downloadFile: (path: string) => Promise<Blob | null>;
  deleteFile: (path: string) => Promise<boolean>;
  listFiles: (prefix?: string) => Promise<FileObject[] | null>;
  getPublicUrl: (path: string) => string | null;
  loading: boolean;
  error: Error | null;
}

export function useStorage(): UseStorageReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const storageService = StorageService.getInstance();

  const handleOperation = async <T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      console.error(errorMessage, err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, path: string) => {
    return handleOperation(
      () => storageService.uploadFile(file, path),
      'Error uploading file'
    );
  };

  const downloadFile = async (path: string) => {
    return handleOperation(
      () => storageService.downloadFile(path),
      'Error downloading file'
    );
  };

  const deleteFile = async (path: string) => {
    return handleOperation(
      () => storageService.deleteFile(path),
      'Error deleting file'
    );
  };

  const listFiles = async (prefix?: string) => {
    return handleOperation(
      () => storageService.listFiles(prefix),
      'Error listing files'
    );
  };

  const getPublicUrl = (path: string) => {
    try {
      return storageService.getPublicUrl(path);
    } catch (err) {
      console.error('Error getting public URL:', err);
      setError(err instanceof Error ? err : new Error('Error getting public URL'));
      return null;
    }
  };

  return {
    uploadFile,
    downloadFile,
    deleteFile,
    listFiles,
    getPublicUrl,
    loading,
    error,
  };
}
