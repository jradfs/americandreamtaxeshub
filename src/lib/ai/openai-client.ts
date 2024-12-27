import { OpenAI } from 'openai';

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Utility function for making API calls
export async function createChatCompletion(
  messages: OpenAI.ChatCompletionMessageParam[],
  model: string = 'gpt-4'
) {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });
    return response.choices[0].message?.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to process AI request');
  }
}