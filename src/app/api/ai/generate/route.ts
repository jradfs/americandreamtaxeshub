import { NextResponse } from 'next/server';
import { summarizeText } from '@/lib/ai/summarize';

export async function POST(request: Request) {
  try {
    const { text, maxLength } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const summary = await summarizeText(text, maxLength);
    return NextResponse.json({ summary });
    
  } catch (error) {
    console.error('Generate Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}