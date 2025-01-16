import { classifyText } from "./classify";
import { createChatCompletion } from "./openai-client";

// Define task categories based on analysis
export const TASK_CATEGORIES = [
  "Payroll Processing",
  "Tax Preparation",
  "Documentation",
  "Client Management",
  "Employee Management",
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];

/**
 * Classifies a task based on its title and description
 * @param title Task title
 * @param description Task description
 * @returns Promise resolving to the predicted task category
 */
export async function classifyTask(
  title: string,
  description: string,
): Promise<TaskCategory> {
  const input = `Task: ${title}\nDescription: ${description}`;

  // Use existing classification utility
  const result = await classifyText(input);

  // Map result to task categories
  const category = TASK_CATEGORIES.find(
    (c) => c.toLowerCase() === result.toLowerCase(),
  );
  return category || "Documentation"; // Default fallback
}

/**
 * Gets category suggestions for a task with confidence scores
 * @param title Task title
 * @param description Task description
 * @returns Promise resolving to array of category suggestions with scores
 */
export async function getCategorySuggestions(
  title: string,
  description: string,
): Promise<Array<{ category: TaskCategory; confidence: number }>> {
  const input = `Task: ${title}\nDescription: ${description}`;

  const response = await createChatCompletion(
    [
      {
        role: "system",
        content: `Analyze this task and provide category suggestions with confidence scores in JSON format. 
    Categories: ${TASK_CATEGORIES.join(", ")}
    Example response format:
    [
      {"category": "Payroll Processing", "confidence": 0.95},
      {"category": "Documentation", "confidence": 0.75}
    ]
    Return only valid JSON without any additional text or formatting.`,
      },
      {
        role: "user",
        content: input,
      },
    ],
    "gpt-4o-mini",
  );

  if (!response) {
    throw new Error("No content in AI response");
  }

  console.log("Raw AI Response:", response); // Log raw response

  try {
    // Remove any non-JSON content
    const jsonStart = response.indexOf("[");
    const jsonEnd = response.lastIndexOf("]") + 1;
    const jsonContent = response.slice(jsonStart, jsonEnd);

    console.log("Extracted JSON:", jsonContent); // Log extracted JSON

    // Parse and validate the response
    const parsed = JSON.parse(jsonContent);

    if (!Array.isArray(parsed)) {
      throw new Error("Response is not an array");
    }

    // Validate each suggestion
    const validSuggestions = parsed.map((suggestion) => {
      if (!TASK_CATEGORIES.includes(suggestion.category)) {
        throw new Error(`Invalid category: ${suggestion.category}`);
      }
      if (
        typeof suggestion.confidence !== "number" ||
        suggestion.confidence < 0 ||
        suggestion.confidence > 1
      ) {
        throw new Error(`Invalid confidence value: ${suggestion.confidence}`);
      }
      return suggestion;
    });

    return validSuggestions;
  } catch (error) {
    console.error("Failed to parse AI response:", response);
    throw new Error(
      `Failed to parse AI response: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
