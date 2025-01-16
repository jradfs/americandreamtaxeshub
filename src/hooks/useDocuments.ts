"use client";

import { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { Database } from "@/types/database.types";

type Document = Database["public"]["Tables"]["client_documents"]["Row"];
type DocumentInsert =
  Database["public"]["Tables"]["client_documents"]["Insert"];

export const useDocuments = (clientId: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [clientId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    const { data, error } = await supabaseBrowserClient
      .from("client_documents")
      .select("*")
      .eq("client_id", clientId);

    if (error) {
      console.error("Error fetching documents:", error);
      return;
    }

    setDocuments(data || []);
    setIsLoading(false);
  };

  return {
    documents,
    isLoading,
    fetchDocuments,
  };
};
