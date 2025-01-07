'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database.types';
import type { ClientWithRelations, ContactInfo, TaxInfo } from '@/types/clients';

interface ClientDetailsProps {
  clientId: string;
}

type ClientResponse = Database['public']['Tables']['clients']['Row'] & {
  documents: Database['public']['Tables']['client_documents']['Row'][]
  workflows: Database['public']['Tables']['client_onboarding_workflows']['Row'][]
  assigned_preparer: Database['public']['Tables']['users']['Row'] | null
  tax_returns: Database['public']['Tables']['tax_returns']['Row'][]
  projects: Database['public']['Tables']['projects']['Row'][]
}

export function ClientDetails({ clientId }: ClientDetailsProps) {
  const [client, setClient] = useState<ClientWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select(`
            *,
            assigned_preparer:users(id, full_name, email),
            documents:client_documents(*),
            workflows:client_onboarding_workflows(*),
            tax_returns:tax_returns(*),
            projects:projects(*)
          `)
          .eq('id', clientId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const clientData = data as unknown as ClientResponse;
          const enhancedClient: ClientWithRelations = {
            ...clientData,
            contact_info: clientData.contact_info as ContactInfo,
            tax_info: clientData.tax_info as TaxInfo,
            documents: clientData.documents,
            workflows: clientData.workflows,
            assigned_preparer: clientData.assigned_preparer,
            tax_returns: clientData.tax_returns,
            projects: clientData.projects,
          };
          setClient(enhancedClient);
        }
      } catch (error) {
        console.error('Error fetching client:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [clientId, supabase]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  const contactInfo = client.contact_info;
  const taxInfo = client.tax_info;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Client Details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold">Basic Information</h3>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-medium">Name:</span> {client.full_name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {client.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {contactInfo?.phone}
              </p>
              <p>
                <span className="font-medium">Status:</span> {client.status}
              </p>
              <p>
                <span className="font-medium">Type:</span> {client.type}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Tax Information</h3>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-medium">Filing Status:</span>{' '}
                {taxInfo?.filing_status}
              </p>
              <p>
                <span className="font-medium">Tax ID:</span> {taxInfo?.tax_id}
              </p>
              <p>
                <span className="font-medium">Last Filed:</span>{' '}
                {taxInfo?.last_filed_date}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Documents</h3>
        <div className="mt-2">
          {client.documents?.length ? (
            <ul className="space-y-2">
              {client.documents.map((doc) => (
                <li key={doc.id}>
                  {doc.document_name} - {doc.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents found</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Projects</h3>
        <div className="mt-2">
          {client.projects?.length ? (
            <ul className="space-y-2">
              {client.projects.map((project) => (
                <li key={project.id}>
                  {project.name} - {project.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No projects found</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Tax Returns</h3>
        <div className="mt-2">
          {client.tax_returns?.length ? (
            <ul className="space-y-2">
              {client.tax_returns.map((taxReturn) => (
                <li key={taxReturn.id}>
                  {taxReturn.tax_year} - {taxReturn.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tax returns found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientDetails;




