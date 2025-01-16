import React, { useState, useEffect } from "react";
import { supabaseBrowserClient as supabase } from "@/lib/supabaseBrowserClient";

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user);
    };
    getSession();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email || "User"}!</p>
      <ul>
        <li>
          <a href="/clients">Manage Clients</a>
        </li>
        <li>
          <a href="/documents">Document Center</a>
        </li>
        <li>
          <a href="/taxreturns">Tax Return Workspace</a>
        </li>
      </ul>
    </div>
  );
}
