import { createChatCompletion } from "./openai-client";

// Define classification categories to match task categories
export type ClassificationCategory =
  | "Client Communication"
  | "Tax Preparation"
  | "Document Review"
  | "Financial Analysis"
  | "Task Management";

// Function to classify text input
export async function classifyText(
  text: string,
): Promise<ClassificationCategory> {
  const prompt = `Classify the following text into one of these categories: 
  - Client Communication
  - Tax Preparation
  - Document Review
  - Financial Analysis
  - Task Management

Text: "${text}"

Return only the category name.`;

  const result = await createChatCompletion([
    { role: "user", content: prompt },
  ]);

  if (!result) {
    throw new Error("Classification failed");
  }

  return result.trim() as ClassificationCategory;
}
