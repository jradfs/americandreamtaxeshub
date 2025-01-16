import { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { GET } from "../route";
import { createMockSupabaseClient } from "@/lib/supabase/__mocks__/supabase";

jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createRouteHandlerClient: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("GET /api/projects", () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    (createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return projects", async () => {
    const mockProjects = [{ id: 1, name: "Project 1" }];
    mockSupabase
      .from("projects")
      .select.mockResolvedValue({ data: mockProjects, error: null });

    const request = new NextRequest("http://localhost:3000/api/projects");
    const response = await GET(request);
    const data = await response.json();

    expect(data).toEqual(mockProjects);
    expect(mockSupabase.from).toHaveBeenCalledWith("projects");
    expect(mockSupabase.from("projects").select).toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockError = new Error("Database error");
    mockSupabase.from("projects").select.mockRejectedValue(mockError);

    const request = new NextRequest("http://localhost:3000/api/projects");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Failed to fetch projects" });
  });
});
