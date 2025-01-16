import { useState } from "react";
import { TaskCategory } from "@/lib/ai/tasks";

export function useAITasks() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function classifyTask(title: string, description: string) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/classify-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to classify task");
      }

      const data = await response.json();
      return data as {
        category: TaskCategory;
        suggestions: Array<{ category: TaskCategory; confidence: number }>;
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Classification failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    classifyTask,
    isLoading,
    error,
  };
}
