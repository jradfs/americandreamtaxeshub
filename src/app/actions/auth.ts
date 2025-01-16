"use server";

import { getRouteClient } from "@/lib/supabase/server-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function checkAuthServer() {
  const supabase = getRouteClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return session;
}

export async function signOutServer() {
  const supabase = getRouteClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  redirect("/login");
}

export async function refreshSessionServer() {
  const supabase = getRouteClient();
  const { data, error } = await supabase.auth.refreshSession();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}
