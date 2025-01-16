import Sidebar from "@/components/dashboard/Sidebar";
import { UserNav } from "@/components/dashboard/UserNav";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <Link href="/dashboard" className="text-xl font-semibold">
            American Dream Taxes
          </Link>
          <UserNav />
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
