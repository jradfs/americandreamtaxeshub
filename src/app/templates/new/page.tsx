import TemplateForm from "@/components/templates/template-form";
import { getCategories } from "@/lib/api/templates";
import { redirect } from "next/navigation";

export default async function NewTemplatePage() {
  const categories = await getCategories();

  if (!categories) {
    redirect("/templates");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Template</h1>
      <TemplateForm
        mode="create"
        categories={categories}
        onSuccess={() => redirect("/templates")}
      />
    </div>
  );
}
