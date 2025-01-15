import { getSupabaseServerClient } from '@/lib/supabaseServerClient';
import ClientList from '@/components/client/ClientList';
import { Database } from '@/types/database.types';

async function getClients() {
  const supabase = getSupabaseServerClient();
  const { data: clients } = await supabase.from('clients').select('*');
  return clients || [];
}

export default async function ClientsPage() {
  const initialClients = await getClients();

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Clients</h1>
      <ClientList initialClients={initialClients} />
    </main>
  );
} 