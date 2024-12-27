import { NextResponse } from 'next/server';
import { classifyText } from '@/lib/ai/classify';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const category = await classifyText(text);
    return NextResponse.json({ category });
    
  } catch (error) {
    console.error('Classification Error:', error);
    return NextResponse.json(
      { error: 'Failed to classify text' },
      { status: 500 }
    );
  }
}