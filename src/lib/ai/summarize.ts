import { createChatCompletion } from './openai-client';

// Function to summarize text input
export async function summarizeText(
  text: string,
  maxLength: number = 200
): Promise<string> {
  const prompt = `Summarize the following text in less than ${maxLength} characters:

Text: "${text}"

Return only the summary.`;

  const result = await createChatCompletion([
    { role: 'user', content: prompt }
  ]);

  if (!result) {
    throw new Error('Summarization failed');
  }

  return result.trim();
}