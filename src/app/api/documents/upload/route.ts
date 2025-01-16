import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  categorizeDocument,
  suggestDocumentName,
  extractYearFromFileName,
} from "@/lib/services/document-categorization";
import type { Document } from "@/types/documents";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;
    const clientId = formData.get("clientId") as string;
    const metadata = formData.get("metadata")
      ? JSON.parse(formData.get("metadata") as string)
      : undefined;

    if (!file || !projectId || !clientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Initialize Supabase client
    const supabase = createServerComponentClient({ cookies });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Categorize document
    const category = await categorizeDocument(file.name, file.type);
    const year = extractYearFromFileName(file.name);

    // Generate storage path with metadata
    const storagePath = suggestDocumentName(
      file.name,
      category,
      year,
      metadata,
    );

    // Upload file to storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("documents")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (storageError) {
      throw storageError;
    }

    // Create document record in database
    const documentData: Omit<Document, "id"> = {
      project_id: projectId,
      client_id: clientId,
      name: file.name,
      storage_path: storagePath,
      category,
      type: file.type,
      size: file.size,
      year,
      uploaded_at: new Date().toISOString(),
      uploaded_by: user.id,
      status: "pending",
      metadata,
    };

    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert(documentData)
      .select()
      .single();

    if (dbError) {
      // Cleanup storage if database insert fails
      await supabase.storage.from("documents").remove([storagePath]);
      throw dbError;
    }

    // Create document tracking record
    const { error: trackingError } = await supabase
      .from("document_tracking")
      .insert({
        document_id: document.id,
        project_id: projectId,
        status: "received",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (trackingError) {
      console.error("Error creating document tracking:", trackingError);
      // Don't throw here, as the document was still created successfully
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 },
    );
  }
}
