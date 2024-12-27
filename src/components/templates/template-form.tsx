import { useState } from 'react';
import { Tables } from 'src/types/database.types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus, Minus, GripVertical } from 'lucide-react';

interface Task {
  title: string;
  order: number;
}

interface TemplateFormProps {
  mode: 'create' | 'edit';
  template?: Tables<'project_templates'> & {
    priority?: string;
    tasks?: Task[];
  };
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
    priority: template?.priority || 'medium',
    tasks: template?.tasks || [] as Task[],
  });

  const [newTask, setNewTask] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const addTask = () => {
    if (newTask.trim()) {
      setFormData({
        ...formData,
        tasks: [...formData.tasks, { title: newTask, order: formData.tasks.length }],
      });
      setNewTask('');
    }
  };

  const removeTask = (index: number) => {
    const updatedTasks = formData.tasks.filter((task: Task, i: number) => i !== index);
    setFormData({
      ...formData,
      tasks: updatedTasks,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Template Title
          </label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <Select
              value={formData.categoryId}
              onValueChange={(value: string) =>
                setFormData({ ...formData, categoryId: value })
              }
            >
              <SelectTrigger className="w-full">
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

          <div className="space-y-2">
            <label htmlFor="priority" className="block text-sm font-medium mb-2">
              Priority
            </label>
            <Select
              value={formData.priority}
              onValueChange={(value: string) =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium mb-2">Tasks</label>
        <div className="space-y-3">
          {formData.tasks.map((task: Task, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <Input
                value={task.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const updatedTasks = [...formData.tasks];
                  updatedTasks[index].title = e.target.value;
                  setFormData({ ...formData, tasks: updatedTasks });
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTask(index)}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-3">
            <Input
              value={newTask}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
              placeholder="Add new task"
              className="flex-1"
            />
            <Button type="button" onClick={addTask}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button type="submit">
          {mode === 'create' ? 'Create Template' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}