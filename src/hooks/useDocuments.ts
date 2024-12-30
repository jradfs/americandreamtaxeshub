import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Tables, TablesInsert, Database } from 'src/types/database.types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

type ClientDocument = Tables<'client_documents'>
type DocumentInsert = TablesInsert<'documents'>

export function useDocuments(clientId?: number, projectId?: number) {
  const [documents, setDocuments] = useState<ClientDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (clientId || projectId) {
      fetchDocuments()
    }
  }, [clientId, projectId])

  async function fetchDocuments() {
    try {
      let query = supabase
        .from('client_documents')
        .select('*')
        .order('id', { ascending: false })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      const { data, error } = await query

      if (error) throw error
      setDocuments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function uploadDocument(
    file: File,
    documentInfo: Omit<DocumentInsert, 'storage_path' | 'file_name' | 'file_type'>
  ) {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop() || ''
      const fileName = file.name
      const storagePath = `${documentInfo.client_id}/${Date.now()}_${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file)

      if (uploadError) throw uploadError

      // Create document record in the database
      const { data, error: dbError } = await supabase
        .from('client_documents')
        .insert([{
          document_name: fileName,
          document_type: fileExt,
          client_id: documentInfo.client_id,
          uploaded_at: new Date().toISOString(),
          status: 'pending'
        }])
        .select()

      if (dbError) throw dbError
      setDocuments(prev => [...prev, data[0]])
      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteDocument(id: number) {
    try {

      // Delete document record
      const { error: dbError } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError
      setDocuments(prev => prev.filter(doc => doc.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function getDocumentUrl(storagePath: string) {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(storagePath, 3600) // URL valid for 1 hour

      if (error) throw error
      return data.signedUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    getDocumentUrl,
    refreshDocuments: fetchDocuments,
  }
}
