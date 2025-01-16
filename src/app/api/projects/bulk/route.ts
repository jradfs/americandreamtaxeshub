import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Database } from "@/types/database.types";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Handle cookie parsing errors
              console.error("Error setting cookie:", error);
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: "", ...options, maxAge: 0 });
            } catch (error) {
              // Handle cookie parsing errors
              console.error("Error removing cookie:", error);
            }
          },
        },
      },
    );

    const projects = await request.json();

    const { data, error } = await supabase
      .from("projects")
      .insert(projects)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating projects:", error);
    return NextResponse.json(
      { error: "Failed to create projects" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
