import { useState } from 'react';
import { Tables } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TemplateFormProps {
  mode: 'create' | 'edit';
  template?: Tables<'project_templates'>;
  categories: Tables<'template_categories'>[];
  onSuccess: () => void;
}

export default function TemplateForm({
  mode,
  template,
  categories,
  onSuccess,
}: TemplateFormProps) {
  const [formData, setFormData] = useState({
    title: template?.title || '',
    description: template?.description || '',
    categoryId: template?.category_id || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = mode === 'create'
        ? '/api/templates'
        : `/api/templates/${template?.id}`;
        
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...(mode === 'edit' && { id: template?.id }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving template:', error);
      // TODO: Add error notification
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Template Title
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) =>
            setFormData({ ...formData, categoryId: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {mode === 'create' ? 'Create Template' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}