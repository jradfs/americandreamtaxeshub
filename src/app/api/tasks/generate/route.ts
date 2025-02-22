import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { handleError } from "@/lib/error-handler";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";
import { classifyTask } from "@/lib/ai/tasks";

interface TemplateTask {
  title: string;
  description: string;
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value;
          },
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      },
    );

    const { project_id, template_id } = await request.json();

    if (!project_id || !template_id) {
      return NextResponse.json(
        { error: "project_id and template_id are required" },
        { status: 400 },
      );
    }

    // Fetch template tasks
    const { data: templateTasks, error } = await supabase
      .from("template_tasks")
      .select("*")
      .eq("template_id", template_id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch template tasks" },
        { status: 500 },
      );
    }

    // Insert tasks for project with classification
    const tasksToInsert = await Promise.all(
      templateTasks.map(async (task: TemplateTask) => {
        const category = await classifyTask(task.title, task.description);
        return {
          project_id,
          title: task.title,
          description: task.description,
          status: "not_started" as Database["public"]["Enums"]["task_status"],
          category,
        };
      }),
    );

    const { data: insertedTasks, error: insertError } = await supabase
      .from("tasks")
      .insert(tasksToInsert)
      .select();

    if (insertError) {
      console.error("Failed to insert tasks:", insertError);
      return NextResponse.json(
        { error: "Failed to generate tasks", details: insertError.message },
        { status: 500 },
      );
    }

    return NextResponse.json(insertedTasks);
} catch (error) {
  return handleError(error, "Error generating tasks");
}
}

export const dynamic = "force-dynamic";
