import { Client, Task, Project, Document } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }

  return response.json();
}

export const api = {
  // Client endpoints
  clients: {
    list: () => fetchAPI<Client[]>("/clients"),
    get: (id: string) => fetchAPI<Client>(`/clients/${id}`),
    create: (data: Partial<Client>) =>
      fetchAPI<Client>("/clients", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Client>) =>
      fetchAPI<Client>(`/clients/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => fetchAPI(`/clients/${id}`, { method: "DELETE" }),
  },

  // Task endpoints
  tasks: {
    list: () => fetchAPI<Task[]>("/tasks"),
    get: (id: string) => fetchAPI<Task>(`/tasks/${id}`),
    create: (data: Partial<Task>) =>
      fetchAPI<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Task>) =>
      fetchAPI<Task>(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => fetchAPI(`/tasks/${id}`, { method: "DELETE" }),
  },

  // Project endpoints
  projects: {
    list: () => fetchAPI<Project[]>("/projects"),
    get: (id: string) => fetchAPI<Project>(`/projects/${id}`),
    create: (data: Partial<Project>) =>
      fetchAPI<Project>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Project>) =>
      fetchAPI<Project>(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => fetchAPI(`/projects/${id}`, { method: "DELETE" }),
  },

  // Document endpoints
  documents: {
    list: () => fetchAPI<Document[]>("/documents"),
    get: (id: string) => fetchAPI<Document>(`/documents/${id}`),
    create: (data: FormData) =>
      fetchAPI<Document>("/documents", {
        method: "POST",
        body: data,
        headers: {}, // Let browser set content-type for FormData
      }),
    delete: (id: string) => fetchAPI(`/documents/${id}`, { method: "DELETE" }),
  },
};

export default api;
