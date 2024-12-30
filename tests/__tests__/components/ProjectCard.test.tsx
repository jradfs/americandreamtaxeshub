import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectCard } from '@/components/projects/ProjectCard'

describe('ProjectCard', () => {
  const mockProject = {
    id: '1',
    name: 'Test Project',
    description: 'Test Description',
    status: 'In Progress',
    dueDate: '2024-12-31',
    clientId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} />)
    
    expect(screen.getByText(mockProject.name)).toBeInTheDocument()
    expect(screen.getByText(mockProject.description)).toBeInTheDocument()
    expect(screen.getByText(mockProject.status)).toBeInTheDocument()
  })

  it('handles edit button click', () => {
    const onEdit = jest.fn()
    render(<ProjectCard project={mockProject} onEdit={onEdit} />)
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledWith(mockProject)
  })

  it('handles delete button click', () => {
    const onDelete = jest.fn()
    render(<ProjectCard project={mockProject} onDelete={onDelete} />)
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith(mockProject.id)
  })

  it('displays status with correct styling', () => {
    render(<ProjectCard project={mockProject} />)
    
    const statusElement = screen.getByText(mockProject.status)
    expect(statusElement).toHaveClass('bg-yellow-100')
  })
})
