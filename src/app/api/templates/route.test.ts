import { createMocks } from 'node-mocks-http';
import { GET, POST, PUT } from './route';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';
import type { CreateTemplateRequest, TemplateResponse } from './route';

// Mock Supabase client
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}));

describe('Template API Routes', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      returns: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('GET /api/templates', () => {
    it('should fetch templates with filters', async () => {
      const mockTemplates: TemplateResponse[] = [
        {
          id: '1',
          title: 'Test Template',
          description: 'Test Description',
          default_priority: 'medium',
          project_defaults: {},
          category: {
            id: '1',
            name: 'Test Category',
          },
          tasks: [],
          metadata: {
            totalEstimatedTime: 0,
            categories: [],
            requiredSkills: [],
          },
        },
      ];

      mockSupabase.single.mockResolvedValue({ data: mockTemplates, error: null });

      const { req } = createMocks({
        method: 'GET',
        query: {
          categoryId: '1',
          search: 'test',
          sortBy: 'title',
          sortOrder: 'asc',
        },
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockTemplates);
    });
  });

  describe('POST /api/templates', () => {
    it('should create a new template', async () => {
      const mockTemplate: CreateTemplateRequest = {
        title: 'New Template',
        description: 'New Description',
        default_priority: 'medium',
        category_id: '1',
        tasks: [
          {
            title: 'Task 1',
            description: 'Task Description',
            priority: 'medium',
            estimated_minutes: 30,
          },
        ],
      };

      mockSupabase.single.mockResolvedValueOnce({ 
        data: { id: '1', ...mockTemplate },
        error: null,
      });

      const { req } = createMocks({
        method: 'POST',
        body: mockTemplate,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data.title).toBe(mockTemplate.title);
    });

    it('should return 400 for missing required fields', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          description: 'Missing title and category_id',
        },
      });

      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/templates/:id', () => {
    it('should update an existing template', async () => {
      const mockUpdate = {
        id: '1',
        title: 'Updated Template',
        description: 'Updated Description',
        default_priority: 'high' as const,
        category_id: '1',
      };

      mockSupabase.single.mockResolvedValue({
        data: mockUpdate,
        error: null,
      });

      const { req } = createMocks({
        method: 'PUT',
        body: mockUpdate,
        query: { id: '1' },
      });

      const response = await PUT(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe(mockUpdate.title);
    });

    it('should return 404 for non-existent template', async () => {
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Template not found' },
      });

      const { req } = createMocks({
        method: 'PUT',
        body: { title: 'Update Non-existent' },
        query: { id: 'non-existent' },
      });

      const response = await PUT(req);
      expect(response.status).toBe(404);
    });
  });
});
