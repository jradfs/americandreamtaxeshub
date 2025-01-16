import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Database } from "@/types/database.types";

export async function GET() {
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

  const workflowStages = [
    {
      stage: "Client Intake",
      tasks: ["New client form", "Engagement letter"],
    },
    {
      stage: "Document Collection",
      tasks: ["Document checklist", "Reminders"],
    },
    {
      stage: "Preparation",
      tasks: ["Data entry", "Calculations"],
    },
    {
      stage: "Review",
      tasks: ["Quality check", "Client approval"],
    },
    {
      stage: "Filing",
      tasks: ["E-file submission", "Paper filing"],
    },
    {
      stage: "Follow-up",
      tasks: ["Acknowledgement", "Amendments"],
    },
  ];

  return NextResponse.json(workflowStages);
}
