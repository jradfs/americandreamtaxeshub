import { Database } from "@/types/database.types";

export interface TaxReturn {
  id: string;
  name: string;
  status: string;
  year: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

// Mock data for tax returns
export const taxReturns: TaxReturn[] = [
  {
    id: "1",
    name: "2023 Tax Return - Individual",
    status: "In Progress",
    year: 2023,
  },
  {
    id: "2",
    name: "2023 Tax Return - Business",
    status: "Not Started",
    year: 2023,
  },
];

// Mock data for team members
export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Tax Preparer",
    email: "john@example.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Reviewer",
    email: "jane@example.com",
  },
  {
    id: "3",
    name: "Mike Johnson",
    role: "Manager",
    email: "mike@example.com",
  },
];
