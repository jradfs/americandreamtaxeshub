import { createChatCompletion as generate } from './openai-client';
import { classifyText as classify } from './classify';
import { sqlAgent } from 'src/lib/supabase/mcp-server';

export class AIService {
  static async handleRequest(type: string, params: any) {
    switch (type) {
      case 'generate':
        return await generate(params.prompt);
      case 'classify':
        return await classify(params.text);
      case 'sql-agent':
        return await sqlAgent({
          query: params.query,
          parameters: params.parameters || []
        });
      default:
        throw new Error('Invalid AI operation type');
    }
  }
}