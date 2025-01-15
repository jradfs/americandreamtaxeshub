'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectFormHeaderProps {
  isEditing: boolean;
  isSubmitting: boolean;
}

export function ProjectFormHeader({ isEditing, isSubmitting }: ProjectFormHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">
        {isEditing ? 'Edit Project' : 'Create New Project'}
      </h2>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-[150px]"
      >
        {isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {isEditing ? 'Update Project' : 'Create Project'}
      </Button>
    </div>
  );
} 