import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TemplateCategoryManager } from "../TemplateCategoryManager";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Mock Supabase client
jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createClientComponentClient: jest.fn(),
}));

// Mock toast notifications
jest.mock("@/lib/toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

describe("TemplateCategoryManager", () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
    };
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  test("renders category input fields", () => {
    mockSupabase.select.mockResolvedValue({ data: [], error: null });

    render(<TemplateCategoryManager />);

    expect(screen.getByPlaceholderText("Category Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
  });

  test("adds a new category", async () => {
    const mockCategory = {
      id: "1",
      name: "Test Category",
      description: "Test Description",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockSupabase.select.mockResolvedValue({
      data: [],
      error: null,
    });

    mockSupabase.insert.mockResolvedValue({
      data: [mockCategory],
      error: null,
    });

    render(<TemplateCategoryManager />);

    const nameInput = screen.getByPlaceholderText("Category Name");
    const descInput = screen.getByPlaceholderText("Description");
    const addButton = screen.getByText("Add Category");

    fireEvent.change(nameInput, { target: { value: "Test Category" } });
    fireEvent.change(descInput, { target: { value: "Test Description" } });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        name: "Test Category",
        description: "Test Description",
      });
    });
  });

  test("updates an existing category", async () => {
    const mockCategories = [
      {
        id: "1",
        name: "Original Category",
        description: "Original Description",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const updatedCategory = {
      ...mockCategories[0],
      name: "Updated Category",
      description: "Updated Description",
    };

    mockSupabase.select.mockResolvedValue({
      data: mockCategories,
      error: null,
    });

    mockSupabase.update.mockResolvedValue({
      data: [updatedCategory],
      error: null,
    });

    render(<TemplateCategoryManager />);

    // Open edit dialog
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    // Change category details
    const nameInput = screen.getByPlaceholderText("Category Name");
    const descInput = screen.getByPlaceholderText("Description");

    fireEvent.change(nameInput, { target: { value: "Updated Category" } });
    fireEvent.change(descInput, { target: { value: "Updated Description" } });

    // Save changes
    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Updated Category",
          description: "Updated Description",
        }),
        expect.anything(),
      );
    });
  });
});
