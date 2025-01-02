import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Document, DocumentFormData } from '@/types/hooks'
import { Database } from '@/types/database.types'

interface UseDocumentsOptions {
  projectId?: string
  clientId?: string
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchDocuments()
  }, [options.projectId, options.clientId])

  async function fetchDocuments() {
    try {
      let query = supabase
        .from('documents')
        .select(`
          *,
          project:project_id (*),
          client:client_id (*)
        `)
        .order('created_at', { ascending: false })

      if (options.projectId) {
        query = query.eq('project_id', options.projectId)
      }

      if (options.clientId) {
        query = query.eq('client_id', options.clientId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setDocuments(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching documents:', err)
      setError('Failed to fetch documents')
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  async function uploadDocument(file: File, documentInfo: DocumentFormData) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('projectId', documentInfo.project_id || '')
      formData.append('clientId', documentInfo.client_id || '')
      formData.append('category', documentInfo.category || '')
      formData.append('description', documentInfo.description || '')

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload document')
      }

      const data = await response.json()
      setDocuments(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error uploading document:', err)
      return { data: null, error: 'Failed to upload document' }
    }
  }

  async function deleteDocument(documentId: string) {
    try {
      const response = await fetch(`/api/documents?id=${documentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      return { error: null }
    } catch (err) {
      console.error('Error deleting document:', err)
      return { error: 'Failed to delete document' }
    }
  }

  async function updateDocument(
    documentId: string,
    updates: Partial<Omit<Document, 'id' | 'created_at' | 'updated_at'>>
  ) {
    try {
      const { data, error: updateError } = await supabase
        .from('documents')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .select(`
          *,
          project:project_id (*),
          client:client_id (*)
        `)
        .single()

      if (updateError) throw updateError

      setDocuments(prev =>
        prev.map(doc => (doc.id === documentId ? data : doc))
      )
      return { data, error: null }
    } catch (err) {
      console.error('Error updating document:', err)
      return { data: null, error: 'Failed to update document' }
    }
  }

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    updateDocument
  }
}
