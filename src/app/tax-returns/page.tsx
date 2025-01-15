import { getSupabaseServerClient } from '@/lib/supabaseServerClient';
import TaxReturnList from '@/components/tax-return/TaxReturnList';
import { Database } from '@/types/database.types';

async function getTaxReturns() {
  const supabase = getSupabaseServerClient();
  const { data: returns } = await supabase.from('tax_returns').select('*');
  return returns || [];
}

export default async function TaxReturnsPage() {
  const initialReturns = await getTaxReturns();

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Tax Returns</h1>
      <TaxReturnList initialReturns={initialReturns} />
    </main>
  );
} 