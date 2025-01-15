"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/database.types";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { isValidFileName } from "@/lib/validations";
import { useOfflineSync } from "@/hooks/useOfflineSync";

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
type TaxReturnRow = Database["public"]["Tables"]["tax_returns"]["Row"];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [search, setSearch] = useState("");
  const [previewDoc, setPreviewDoc] = useState<DocumentRow | null>(null);
  const [taxReturns, setTaxReturns] = useState<TaxReturnRow[]>([]);
  const [selectedReturn, setSelectedReturn] = useState<string>("");
  const { syncOfflineChanges } = useOfflineSync();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ file: FileList; linkReturnId: string }>();

  async function fetchDocuments() {
    const { data, error } = await supabaseBrowserClient.from("documents").select("*");
    if (!error && data) {
      setDocs(data);
    }
  }

  async function fetchTaxReturns() {
    const { data, error } = await supabaseBrowserClient.from("tax_returns").select("*");
    if (!error && data) {
      setTaxReturns(data);
    }
  }

  useEffect(() => {
    fetchDocuments();
    fetchTaxReturns();

    // Real-time updates for documents
    const channel = supabaseBrowserClient
      .channel("documents")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        () => fetchDocuments()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  async function onUpload(data: { file: FileList; linkReturnId: string }) {
    const file = data.file?.[0];
    if (!file) return;
    if (!isValidFileName(file.name)) {
      alert("Invalid file name.");
      return;
    }
    // Example: store offline if user is offline
    // syncOfflineChanges(...)
    // Or do direct upload:
    const { data: storageData, error: storageErr } = await supabaseBrowserClient.storage
      .from("docs")
      .upload(file.name, file);
    if (storageErr) {
      alert(storageErr.message);
      return;
    }
    // Insert record into documents
    const insertPayload: Partial<DocumentRow> = {
      file_name: file.name,
      file_path: storageData?.path ?? "",
      document_status: "uploaded",
    };
    if (data.linkReturnId) {
      insertPayload.linked_return_id = parseInt(data.linkReturnId);
    }
    const { error: docErr } = await supabaseBrowserClient
      .from("documents")
      .insert(insertPayload);
    if (docErr) {
      alert(docErr.message);
      return;
    }
    reset();
    await fetchDocuments();
  }

  const filteredDocs = docs.filter((d) =>
    d.file_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">Upload</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(onUpload)}
                  className="space-y-4 mt-2"
                >
                  <input type="file" {...register("file", { required: true })} />
                  {errors.file && (
                    <p className="text-red-500 text-sm">File is required.</p>
                  )}

                  <div>
                    <label className="block font-medium mb-1">
                      Link to Tax Return (optional)
                    </label>
                    <select
                      className="border rounded p-2 w-full"
                      {...register("linkReturnId")}
                    >
                      <option value="">No Linking</option>
                      {taxReturns.map((tr) => (
                        <option key={tr.id} value={tr.id}>
                          {tr.name} (ID: {tr.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit">Upload</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {filteredDocs.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No documents found.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">File Name</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Linked Return</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="border-b last:border-none">
                    <td className="py-2">{doc.file_name}</td>
                    <td className="py-2">{doc.document_status}</td>
                    <td className="py-2">
                      {doc.linked_return_id
                        ? `Tax Return #${doc.linked_return_id}`
                        : "None"}
                    </td>
                    <td className="py-2 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewDoc(doc)}
                      >
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Example preview dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{previewDoc?.file_name}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            {/* 
              Actual preview logic using PDF viewer or custom component could go here.
              Could also embed a doc viewer.
            */}
            This is a placeholder for a more advanced document preview.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 