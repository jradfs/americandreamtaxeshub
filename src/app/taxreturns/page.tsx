"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/database.types";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type BaseReturn = Database["public"]["Tables"]["tax_returns"]["Row"];
type TaxReturn = Omit<BaseReturn, "client_id"> & {
  client_id: string;
  clients: {
    full_name: string;
  };
};

export default function TaxReturnsPage() {
  const [returns, setReturns] = useState<TaxReturn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchReturns() {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseBrowserClient
        .from("tax_returns")
        .select("*, clients(full_name)");
      
      if (error) throw error;
      
      if (data) {
        setReturns(data as unknown as TaxReturn[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tax returns');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchReturns();
  }, []);

  function renderStatusIcon(status?: string) {
    switch (status) {
      case "approved":
        return <CheckCircle className="text-green-500 w-4 h-4" />;
      case "rejected":
        return <AlertCircle className="text-red-500 w-4 h-4" />;
      default:
        return <span className="text-sm text-muted-foreground">{status}</span>;
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-destructive">Error: {error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Tax Returns</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchReturns()}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : returns.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              No tax returns found.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Client</th>
                  <th className="py-2">Tax Year</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Due Date</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((r) => (
                  <tr key={r.id} className="border-b last:border-none">
                    <td className="py-2">{r.clients.full_name}</td>
                    <td className="py-2">{r.tax_year}</td>
                    <td className="py-2 flex items-center gap-2">
                      {renderStatusIcon(r.status)} {r.status}
                    </td>
                    <td className="py-2">{new Date(r.due_date).toLocaleDateString()}</td>
                    <td className="py-2">
                      <Button variant="outline" size="sm">Open</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 