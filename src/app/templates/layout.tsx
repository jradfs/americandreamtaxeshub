import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServerClient";

export default async function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}
