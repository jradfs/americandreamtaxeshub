import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  
  const workflowStages = [
    {
      stage: 'Client Intake',
      tasks: ['New client form', 'Engagement letter']
    },
    {
      stage: 'Document Collection',
      tasks: ['Document checklist', 'Reminders']
    },
    {
      stage: 'Preparation',
      tasks: ['Data entry', 'Calculations']
    },
    {
      stage: 'Review',
      tasks: ['Quality check', 'Client approval']
    },
    {
      stage: 'Filing',
      tasks: ['E-file submission', 'Paper filing']
    },
    {
      stage: 'Follow-up',
      tasks: ['Acknowledgement', 'Amendments']
    }
  ];

  return NextResponse.json(workflowStages);
}