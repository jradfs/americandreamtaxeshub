import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectWithRelations } from '@/types/projects'

describe('ProjectCard', () => {
  const mockProject: ProjectWithRelations = {
    id: '1',
    name: 'Test Project',
    description: 'Test Description',
    status: 'in_progress',
    priority: 'high',
    due_date: '2024-12-31',
    client_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      service: 'tax_returns',
      tax_info: {
        return_type: '1040',
        tax_year: 2023,
        filing_deadline: '2024-04-15',
        extension_filed: false,
        review_status: 'not_started'
      }
    },
    tasks: [
      { 
        id: '1', 
        title: 'Task 1',
        status: 'completed',
        priority: 'high',
        due_date: '2024-01-15',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: '2', 
        title: 'Task 2',
        status: 'in_progress',
        priority: 'medium',
        due_date: '2024-02-15',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: '3', 
        title: 'Task 3',
        status: 'not_started',
        priority: 'low',
        due_date: '2024-03-15',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    client: {
      id: '1',
      company_name: 'Test Company',
      full_name: 'John Doe',
      contact_info: {
        email: 'john@testcompany.com',
        phone: '555-0123',
        address: '123 Test St'
      }
    },
    tax_info: {
      return_type: '1040',
      tax_year: 2023,
      filing_deadline: '2024-04-15',
      extension_filed: false,
      review_status: 'not_started'
    }
  }

  it('renders loading state correctly', () => {
    render(<ProjectCard project={mockProject} isLoading={true} />)
    expect(screen.getByTestId('project-card-skeleton')).toBeInTheDocument()
  })

  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} />)
    
    // Basic project info
    expect(screen.getByText(mockProject.name)).toBeInTheDocument()
    expect(screen.getByText(mockProject.description)).toBeInTheDocument()
    expect(screen.getByText(mockProject.status.replace('_', ' '))).toBeInTheDocument()
    expect(screen.getByText(mockProject.priority)).toBeInTheDocument()
    
    // Client info
    expect(screen.getByText(mockProject.client.company_name)).toBeInTheDocument()
    expect(screen.getByText(mockProject.client.full_name)).toBeInTheDocument()
    
    // Service category
    expect(screen.getByText('Tax Returns')).toBeInTheDocument()
    
    // Tax info
    if (mockProject.tax_info) {
      expect(screen.getByText(`${mockProject.tax_info.return_type} - ${mockProject.tax_info.tax_year}`)).toBeInTheDocument()
      expect(screen.getByText(mockProject.tax_info.review_status.replace('_', ' '))).toBeInTheDocument()
    }
  })

  it('calculates and displays progress correctly', () => {
    render(<ProjectCard project={mockProject} />)
    
    const completedTasks = mockProject.tasks.filter(t => t.status === 'completed').length
    const totalTasks = mockProject.tasks.length
    const progress = Math.round((completedTasks / totalTasks) * 100)
    
    expect(screen.getByText(`${progress}%`)).toBeInTheDocument()
    const progressBar = screen.getByTestId('progress-bar')
    expect(progressBar).toHaveStyle({ width: `${progress}%` })
  })

  it('displays deadline information correctly', () => {
    render(<ProjectCard project={mockProject} />)
    
    // Format the due date for display
    const dueDate = new Date(mockProject.due_date)
    const formattedDueDate = dueDate.toLocaleDateString()
    
    expect(screen.getByText(formattedDueDate)).toBeInTheDocument()
    
    // If it's a tax return, also check the filing deadline
    if (mockProject.tax_info) {
      const filingDeadline = new Date(mockProject.tax_info.filing_deadline)
      const formattedFilingDeadline = filingDeadline.toLocaleDateString()
      expect(screen.getByText(formattedFilingDeadline)).toBeInTheDocument()
    }
  })

  it('shows extension status for tax returns', () => {
    render(<ProjectCard project={mockProject} />)
    
    if (mockProject.tax_info) {
      const extensionStatus = mockProject.tax_info.extension_filed ? 'Extended' : 'No Extension'
      expect(screen.getByText(extensionStatus)).toBeInTheDocument()
    }
  })
})
