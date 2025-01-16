import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";

export async function GET(request: Request) {
  const supabase = supabaseServerClient();
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .order("start_time", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = supabaseServerClient();
  const eventData = await request.json();

  const { data, error } = await supabase
    .from("calendar_events")
    .insert(eventData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
