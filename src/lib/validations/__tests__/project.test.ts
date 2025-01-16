import { describe, it, expect } from "vitest";
import { projectSchema } from "../project";
import { v4 as uuidv4 } from "uuid";

const validProject = {
  name: "Test Project",
  client_id: uuidv4(),
  parent_project_id: uuidv4(),
  primary_manager: uuidv4(),
  service_type: "tax_return",
  tax_info: {
    return_type: "1040",
    tax_year: "2023",
  },
};

describe("Project Schema Validation", () => {
  it("validates a valid project", () => {
    const result = projectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it("requires tax info for tax return service type", () => {
    const invalidProject = {
      ...validProject,
      tax_info: undefined,
    };
    const result = projectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["tax_info"],
            message: "Required",
          }),
        ]),
      );
    }
  });
});
