"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export function Header() {
  const { user, signOut, loading } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          American Dream Taxes
        </Link>

        <nav className="flex items-center gap-4">
          {!loading && user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
