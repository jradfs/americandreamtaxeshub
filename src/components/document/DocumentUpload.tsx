import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../../hooks/use-toast";

export default function DocumentUpload({ clientId, projectId }) {
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      // Determine appropriate bucket based on context
      const bucket = projectId
        ? "project-files"
        : clientId
          ? "client-documents"
          : "tax-documents";

      const filePath = `${bucket}/${clientId || "general"}/${Date.now()}-${selectedFile.name}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, selectedFile);

      if (error) throw error;

      // Insert metadata into documents table
      const { error: insertError } = await supabase.from("documents").insert({
        file_path: filePath,
        file_name: selectedFile.name,
        client_id: clientId,
        project_id: projectId,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
      });

      if (insertError) throw insertError;

      toast({
        title: "Upload successful",
        description: "Your document has been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        accept=".pdf,.jpg,.jpeg,.png,.xlsx"
        disabled={uploading}
      />
      <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
        {uploading ? "Uploading..." : "Upload Document"}
      </Button>
    </div>
  );
}
