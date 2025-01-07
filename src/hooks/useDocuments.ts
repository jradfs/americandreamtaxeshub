import { useState, useEffect } from 'react'
import { supabaseClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type Document = Database['public']['Tables']['client_documents']['Row']
type DocumentInsert = Database['public']['Tables']['client_documents']['Insert']

export const useDocuments = (clientId: string) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [clientId])

  const fetchDocuments = async () => {
    setIsLoading(true)
    const { data, error } = await supabaseClient
      .from('client_documents')
      .select('*')
      .eq('client_id', clientId)
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Error fetching documents:', error)
    } else {
      setDocuments(data)
    }
    setIsLoading(false)
  }

  const uploadDocument = async (file: File, type: Document['document_type'], dueDate?: Date) => {
    // 1. Upload file to storage
    const { data: fileData, error: uploadError } = await supabaseClient
      .storage
      .from('client-documents')
      .upload(`${clientId}/${file.name}`, file)

    if (uploadError) throw uploadError

    // 2. Create document record
    const documentData: DocumentInsert = {
      client_id: clientId,
      document_name: file.name,
      document_type: type,
      status: 'pending',
      uploaded_at: new Date().toISOString(),
      file_path: fileData?.path
    }

    const { data, error: dbError } = await supabaseClient
      .from('client_documents')
      .insert(documentData)
      .single()

    if (dbError) throw dbError

    await fetchDocuments()
    return data
  }

  const updateDocumentStatus = async (documentId: number, status: Document['status']) => {
    const { error } = await supabaseClient
      .from('client_documents')
      .update({ status })
      .eq('id', documentId)

    if (error) throw error
    await fetchDocuments()
  }

  return {
    documents,
    isLoading,
    uploadDocument,
    updateDocumentStatus,
    fetchDocuments
  }
}
