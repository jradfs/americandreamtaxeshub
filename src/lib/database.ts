import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';
import { handleError } from './error-handler';

const supabase = createServerClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value;
      },
    },
  },
);

import { Tables } from '@/types/database.types';

export async function fetchData<T, TableName extends keyof Tables>(
  tableName: TableName,
  selectQuery = '*'
) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(selectQuery);

    if (error) {
      throw error;
    }
    return data as T;
  } catch (error) {
    return handleError(error, `Error fetching data from ${String(tableName)}`);
  }
}