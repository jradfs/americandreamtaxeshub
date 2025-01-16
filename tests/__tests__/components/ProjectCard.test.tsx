import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectWithRelations } from "@/types/projects";
import { Json } from "@/types/database.types";

describe("ProjectCard", () => {
  const mockProject: ProjectWithRelations = {
    id: "1",
    name: "Test Project",
    description: "Test Description",
    status: "in_progress",
    priority: "high",
    due_date: "2024-12-31",
    client_id: "1",
    service_type: "tax_return",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    template_id: null,
    creation_type: "custom",
    tax_info: {
      return_type: "1040",
      tax_year: 2023,
      filing_deadline: "2024-04-15",
      extension_filed: false,
      review_status: "not_started",
    } as Json,
    accounting_info: null,
    payroll_info: null,
    activity_log: [] as Json,
    checklist: [] as Json,
    dependencies: [],
    assignee_id: null,
    team_members: [],
    tasks: [
      {
        id: "1",
        title: "Task 1",
        status: "completed",
        priority: "high",
        dependencies: [],
        order_index: 0,
        description: null,
        assignee_id: null,
        due_date: "2024-01-15",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Task 2",
        status: "in_progress",
        priority: "medium",
        dependencies: [],
        order_index: 1,
        description: null,
        assignee_id: null,
        due_date: "2024-02-15",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Task 3",
        status: "not_started",
        priority: "low",
        dependencies: [],
        order_index: 2,
        description: null,
        assignee_id: null,
        due_date: "2024-03-15",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    client: {
      id: "1",
      company_name: "Test Company",
      full_name: "John Doe",
      email: "john@testcompany.com",
      phone: "555-0123",
      address: "123 Test St",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };

  it("renders loading state correctly", () => {
    render(<ProjectCard project={mockProject} isLoading={true} />);
    expect(screen.getByTestId("project-card-skeleton")).toBeInTheDocument();
  });

  it("renders project information correctly", () => {
    render(<ProjectCard project={mockProject} />);

    // Basic project info
    expect(screen.getByText(mockProject.name)).toBeInTheDocument();
    expect(
      screen.getByText(mockProject.description as string),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockProject.status.replace("_", " ")),
    ).toBeInTheDocument();
    expect(screen.getByText(mockProject.priority)).toBeInTheDocument();

    // Client info
    expect(
      screen.getByText(mockProject.client.company_name as string),
    ).toBeInTheDocument();
    expect(screen.getByText(mockProject.client.full_name)).toBeInTheDocument();

    // Service type
    expect(screen.getByText("Tax Return")).toBeInTheDocument();

    // Tax info
    const taxInfo = mockProject.tax_info as {
      return_type: string;
      tax_year: number;
      review_status: string;
    };
    expect(
      screen.getByText(`${taxInfo.return_type} - ${taxInfo.tax_year}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(taxInfo.review_status.replace("_", " ")),
    ).toBeInTheDocument();
  });

  it("calculates and displays progress correctly", () => {
    render(<ProjectCard project={mockProject} />);

    const completedTasks =
      mockProject.tasks?.filter((t) => t.status === "completed").length || 0;
    const totalTasks = mockProject.tasks?.length || 0;
    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    expect(screen.getByText(`${progress}%`)).toBeInTheDocument();
    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toHaveStyle({ width: `${progress}%` });
  });

  it("displays deadline information correctly", () => {
    render(<ProjectCard project={mockProject} />);

    // Format the due date for display
    if (mockProject.due_date) {
      const dueDate = new Date(mockProject.due_date);
      const formattedDueDate = dueDate.toLocaleDateString();
      expect(screen.getByText(formattedDueDate)).toBeInTheDocument();
    }

    // If it's a tax return, also check the filing deadline
    if (mockProject.tax_info) {
      const taxInfo = mockProject.tax_info as { filing_deadline: string };
      const filingDeadline = new Date(taxInfo.filing_deadline);
      const formattedFilingDeadline = filingDeadline.toLocaleDateString();
      expect(screen.getByText(formattedFilingDeadline)).toBeInTheDocument();
    }
  });

  it("shows extension status for tax returns", () => {
    render(<ProjectCard project={mockProject} />);

    if (mockProject.tax_info) {
      const taxInfo = mockProject.tax_info as { extension_filed: boolean };
      const extensionStatus = taxInfo.extension_filed
        ? "Extended"
        : "No Extension";
      expect(screen.getByText(extensionStatus)).toBeInTheDocument();
    }
  });
});
