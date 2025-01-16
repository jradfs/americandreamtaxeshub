import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabase } from "@/hooks/useSupabase";
import { Plus, Loader2, FileText, Eye, Download, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Document } from "@/lib/supabase/schema";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function DocumentManager() {
  const {
    data: documents,
    error: documentsError,
    mutate: mutateDocuments,
  } = useSupabase("documents");
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: documentData, error: documentError } = await supabase
        .from("documents")
        .insert([
          {
            name: file.name,
            path: fileName,
            type: file.type,
            size: file.size,
            uploaded_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (documentError) throw documentError;

      mutateDocuments();
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(document.path, 60); // URL valid for 60 seconds

      if (error) throw error;

      setPreviewUrl(data.signedUrl);
      setSelectedDocument(document);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to preview document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (document: Document) => {
    try {
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([document.path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", document.id);

      if (dbError) throw dbError;

      mutateDocuments();
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  if (documentsError) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Failed to load documents
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Documents</CardTitle>
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
          <Label htmlFor="file-upload" asChild>
            <Button disabled={isUploading}>
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Upload Document
            </Button>
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!documents ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No documents found
            </p>
          ) : (
            documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">{document.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(document.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(document)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(document)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            {selectedDocument?.type.startsWith("image/") ? (
              <img
                src={previewUrl!}
                alt={selectedDocument.name}
                className="w-full h-full object-contain"
              />
            ) : selectedDocument?.type === "application/pdf" ? (
              <iframe
                src={previewUrl!}
                className="w-full h-full"
                title={selectedDocument.name}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <FileText className="w-16 h-16 text-primary" />
                <p className="text-center text-muted-foreground">
                  Preview not available for this file type
                </p>
                <Button asChild>
                  <a
                    href={previewUrl!}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
