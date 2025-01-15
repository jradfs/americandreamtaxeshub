import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

export const storageClient = createClient(supabaseUrl, supabaseKey)

export interface StorageUploadResult {
  filePath: string
  error?: Error
}

export async function uploadFileToStorage(file: File): Promise<StorageUploadResult> {
  try {
    const filePath = `documents/${Date.now()}-${file.name}`
    const { error } = await storageClient
      .storage
      .from('documents')
      .upload(filePath, file)

    if (error) {
      throw error
    }

    return { filePath }
  } catch (error) {
    return { 
      filePath: '',
      error: error instanceof Error ? error : new Error('Upload failed')
    }
  }
}
