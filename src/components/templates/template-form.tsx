import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../ui/card';
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

interface TemplateTask {
  id?: string;
  title: string;
  description?: string;
  priority: Database['public']['Enums']['task_priority'] | string;
  dependencies: string[];
  order_index: number;
  estimated_hours?: number;
  required_skills?: string[];
}

interface TemplateFormProps {
  mode: 'create' | 'edit';
  template?: Tables<'project_templates'> & {
    tasks?: TemplateTask[];
    version?: number;
    is_archived?: boolean;
  };
  categories: Tables<'template_categories'>[];
  onSuccess: () => void;
}

interface TemplatePreview {
  total_tasks: number;
  estimated_hours: number;
  required_skills: string[];
  dependencies: Record<string, string[]>;
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
    priority: template?.priority || 'medium' as Database['public']['Enums']['task_priority'],
    version: template?.version || 1,
    is_archived: template?.is_archived || false,
    tasks: template?.tasks || [] as TemplateTask[],
    project_defaults: template?.project_defaults || {},
    recurring_schedule: template?.recurring_schedule || null,
    seasonal_priority: template?.seasonal_priority || null,
  });

  const [newTask, setNewTask] = useState('');
  const [templatePreview, setTemplatePreview] = useState<TemplatePreview>({
    total_tasks: 0,
    estimated_hours: 0,
    required_skills: [],
    dependencies: {}
  });

  useEffect(() => {
    // Calculate template preview stats
    const totalTasks = formData.tasks.length;
    const estimatedHours = formData.tasks.reduce((sum, task) => sum + (task.estimated_hours || 0), 0);
    const requiredSkills = Array.from(new Set(
      formData.tasks.flatMap(task => task.required_skills || [])
    ));
    const dependencies = formData.tasks.reduce((acc, task) => {
      if (task.dependencies && task.dependencies.length > 0) {
        acc[task.title] = task.dependencies;
      }
      return acc;
    }, {} as Record<string, string[]>);

    setTemplatePreview({
      total_tasks: totalTasks,
      estimated_hours: estimatedHours,
      required_skills: requiredSkills,
      dependencies: dependencies
    });
  }, [formData.tasks]);

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
      const newTaskData: TemplateTask = {
        title: newTask,
        priority: 'medium',
        dependencies: [],
        order_index: formData.tasks.length,
        estimated_hours: 1,
        required_skills: []
      };
      
      setFormData({
        ...formData,
        tasks: [...formData.tasks, newTaskData],
      });
      setNewTask('');
    }
  };

  const updateTask = (index: number, field: keyof TemplateTask, value: string | number | string[] | undefined) => {
    const updatedTasks = [...formData.tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };
    setFormData({
      ...formData,
      tasks: updatedTasks
    });
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
          {formData.tasks.map((task: TemplateTask, index: number) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={task.title}
                  onChange={(e) => updateTask(index, 'title', e.target.value)}
                  className="flex-1"
                  placeholder="Task title"
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={task.priority}
                    onValueChange={(value) => updateTask(index, 'priority', value)}
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

                <div>
                  <label className="text-sm font-medium">Estimated Hours</label>
                  <Input
                    type="number"
                    value={task.estimated_hours}
                    onChange={(e) => updateTask(index, 'estimated_hours', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Required Skills</label>
                <Input
                  value={task.required_skills?.join(', ') || ''}
                  onChange={(e) => updateTask(index, 'required_skills', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Comma separated skills"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Dependencies</label>
                <Input
                  value={task.dependencies?.join(', ') || ''}
                  onChange={(e) => updateTask(index, 'dependencies', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Comma separated task titles"
                />
              </div>
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Total Tasks</label>
              <div className="text-lg font-semibold">
                {templatePreview.total_tasks}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Estimated Hours</label>
              <div className="text-lg font-semibold">
                {templatePreview.estimated_hours}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Required Skills</label>
              <div className="text-lg font-semibold">
                {templatePreview.required_skills.join(', ') || 'None'}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Task Dependencies</label>
              <div className="space-y-1">
                {Object.entries(templatePreview.dependencies).map(([task, deps]) => (
                  <div key={task} className="text-sm">
                    {task}: {deps.join(', ')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                ...formData,
                is_archived: !formData.is_archived
              });
            }}
          >
            {formData.is_archived ? 'Unarchive' : 'Archive'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                ...formData,
                version: formData.version + 1
              });
            }}
          >
            Create New Version
          </Button>
        </div>
        <Button type="submit">
          {mode === 'create' ? 'Create Template' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
