import { NextResponse } from "next/server";
import { classifyTask, getCategorySuggestions } from "../../../../lib/ai/tasks";

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    // Get both classification and suggestions
    const [category, suggestions] = await Promise.all([
      classifyTask(title, description),
      getCategorySuggestions(title, description),
    ]);

    return NextResponse.json({
      category,
      suggestions,
    });
  } catch (error) {
    console.error("Task classification error:", error);
    return NextResponse.json(
      { error: "Failed to classify task" },
      { status: 500 },
    );
  }
}
