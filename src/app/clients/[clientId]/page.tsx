import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServerClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

export const revalidate = 0;

async function getClientData(id: string) {
  const supabase = getSupabaseServerClient();
  const { data: clientData } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();
  return clientData;
}

async function getClientDocuments(id: string) {
  const supabase = getSupabaseServerClient();
  const { data: docs } = await supabase
    .from("documents")
    .select("*")
    .eq("client_id", id);
  return docs || [];
}

export default async function ClientProfilePage({
  params,
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;
  const clientData = await getClientData(clientId);
  if (!clientData) {
    notFound();
  }
  const clientDocs = await getClientDocuments(clientId);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">{clientData?.full_name}</h2>
          <p className="text-sm text-muted-foreground">{clientData?.contact_email}</p>
          <p className="text-sm text-muted-foreground">{clientData?.phone}</p>
          <Button variant="outline" size="sm">Edit Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {clientDocs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents uploaded.</p>
          ) : (
            <ul className="space-y-2">
              {clientDocs.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between">
                  <span>{doc.file_name}</span>
                  <Button variant="outline" size="sm">View</Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 