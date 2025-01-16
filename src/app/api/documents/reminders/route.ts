import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { handleError } from "@/lib/error-handler";
import { NextResponse } from "next/server";
import type { Database } from "@/types/database.types";

export async function GET(request: Request) {
  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value;
          },
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce",
        },
      },
    );

    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .order("uploaded_at", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, "Error fetching reminders");
  }
}
