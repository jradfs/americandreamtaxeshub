# Supabase SSR Implementation Guide

## Overview

This guide outlines the proper implementation of Supabase with Next.js 13+ App Router, using `@supabase/ssr` for server and client components.

## Setup

### 1. Installation

```bash
npm install @supabase/ssr @supabase/supabase-js
```

### 2. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Implementation Structure

### 1. Server Client (`src/lib/supabaseServerClient.ts`)

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";

export function getSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    },
  );
}
```

### 2. Browser Client (`src/lib/supabaseBrowserClient.ts`)

```typescript
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

export const supabaseBrowserClient = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

### 3. Server Component Example (`src/app/clients/page.tsx`)

```typescript
import { getSupabaseServerClient } from '@/lib/supabaseServerClient';
import ClientList from '@/components/client/ClientList';

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
```

### 4. Client Hook Example (`src/hooks/useClients.ts`)

```typescript
"use client";

import { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { handleError } from "@/lib/error-handler";
import { Database } from "@/types/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

export function useClients(initialClients?: Client[] | null) {
  const [clients, setClients] = useState<Client[]>(initialClients || []);
  const [loading, setLoading] = useState(!initialClients);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only fetch if no SSR data
    if (!initialClients) {
      fetchClients();
    }

    // Real-time updates
    const channel = supabaseBrowserClient
      .channel("clients")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clients" },
        () => {
          fetchClients();
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // ... rest of the hook implementation
}
```

### 5. Client Component Example (`src/components/client/ClientList.tsx`)

```typescript
'use client';

import React from 'react';
import { useClients } from '@/hooks/useClients';
import { Database } from '@/types/database.types';

type Client = Database['public']['Tables']['clients']['Row'];

interface ClientListProps {
  initialClients?: Client[] | null;
}

export default function ClientList({ initialClients }: ClientListProps) {
  const { clients, loading, error } = useClients(initialClients);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (loading && !clients.length) return <div>Loading...</div>;

  return (
    // Component JSX
  );
}
```

## Best Practices

1. **Client/Server Separation**

   - Use `createServerClient` for Server Components
   - Use `createBrowserClient` for Client Components
   - Never mix server/client code

2. **SSR Data Flow**

   - Fetch initial data in Server Components
   - Pass data to Client Components via props
   - Handle real-time updates on the client

3. **Type Safety**

   - Use Database types throughout
   - Type all client instances
   - Handle null/undefined states

4. **Error Handling**
   - Proper error boundaries
   - Loading states
   - Fallback UI

## Common Issues

1. **Cookie Handling**

   - Server client must use cookies
   - Browser client handles cookies automatically
   - Ensure proper cookie configuration

2. **Real-time Updates**

   - Only subscribe in Client Components
   - Clean up subscriptions
   - Handle connection errors

3. **Type Safety**
   - Import Database types correctly
   - Handle optional props
   - Type all responses
