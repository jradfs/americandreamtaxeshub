import { Database } from '@/types/database.types'

type TaskPriority = Database['public']['Enums']['task_priority']
type ServiceType = Database['public']['Enums']['service_type']

export interface TaskTemplate {
  title: string
  description: string
  priority: TaskPriority
  estimateDueDate?: () => Date
  checklist?: string[]
}

export const onboardingTaskTemplates: Record<ServiceType, TaskTemplate[]> = {
  tax_return: [
    {
      title: 'Initial Tax Return Consultation',
      description: 'Schedule and conduct initial consultation to understand client tax situation and requirements',
      priority: 'high',
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 7)
        return date
      },
      checklist: [
        'Review previous tax returns',
        'Identify required documents',
        'Discuss filing deadlines',
        'Explain tax preparation process',
        'Address client questions and concerns'
      ]
    },
    {
      title: 'Document Collection Setup',
      description: 'Set up document collection system and send document request list',
      priority: 'high',
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 3)
        return date
      },
      checklist: [
        'Create client portal account',
        'Send document checklist',
        'Set up document reminders',
        'Verify client access to portal'
      ]
    }
  ],
  bookkeeping: [
    {
      title: 'Bookkeeping System Setup',
      description: 'Set up accounting software and initial bookkeeping structure',
      priority: 'high',
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 5)
        return date
      },
      checklist: [
        'Set up chart of accounts',
        'Configure accounting software',
        'Import historical data',
        'Set up bank feeds',
        'Train client on basic usage'
      ]
    },
    {
      title: 'Initial Financial Review',
      description: 'Review current financial records and establish baseline',
      priority: 'medium',
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 10)
        return date
      }
    }
  ],
  payroll: [
    {
      title: 'Payroll System Setup',
      description: 'Configure payroll system and employee information',
      priority: 'high',
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 3)
        return date
      },
      checklist: [
        'Collect employee information',
        'Set up direct deposit',
        'Configure tax withholdings',
        'Set up payroll schedule',
        'Test payroll run'
      ]
    },
    {
      title: 'Payroll Compliance Review',
      description: 'Review and ensure compliance with payroll regulations',
      priority: 'high',
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 5)
        return date
      }
    }
  ],
  advisory: [
    {
      title: 'Initial Advisory Meeting',
      description: 'Conduct initial advisory meeting to understand business goals and challenges',
      priority: 'medium',
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 7)
        return date
      },
      checklist: [
        'Review business objectives',
        'Identify key challenges',
        'Discuss growth opportunities',
        'Create initial action plan'
      ]
    },
    {
      title: 'Financial Analysis Setup',
      description: 'Set up financial analysis and reporting framework',
      priority: 'medium',
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 14)
        return date
      }
    }
  ]
} 