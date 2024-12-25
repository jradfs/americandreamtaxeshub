export type Projects = {
    id: string;
    client_id: string | null;
    name: string;
    description: string | null;
    status: string;
    priority: string | null;
    due_date: string | null;
    start_date: string | null;
    stage: string | null;
    template_id: string | null;
    completed_tasks: number | null;
    parent_project_id: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export type ProjectTemplates = {
    id: string;
    title: string;
    description: string | null;
    category: string;
    category_id: string | null;
    created_at: string | null;
    updated_at: string | null;
    default_priority: string | null;
    recurring_schedule: string | null;
    seasonal_priority: Json | null;
};
