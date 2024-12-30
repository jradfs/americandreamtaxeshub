import { NextResponse } from 'next/server';
import { AIService } from 'src/lib/ai/ai-service';

export async function POST(request: Request) {
  try {
    const { query, parameters } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const response = await AIService.handleRequest('ai-agent', { query, parameters });
    return NextResponse.json(response);
  } catch (error) {
    console.error('AI Agent Error:', error);
    return NextResponse.json(
      { error: 'Failed to execute AI query' },
      { status: 500 }
    );
  }
}
