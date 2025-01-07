'use client';

import { useState } from "react";
import { Button } from '@/components/ui/button';
import { PlusCircle } from "lucide-react";
import { CreateProjectDialog } from "./create-project-dialog";
import { useProjects } from '@/hooks/useProjects';

export function NewProjectButton() {
  const [open, setOpen] = useState(false);
  const { fetchProjects } = useProjects();

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        New Project
      </Button>
      
      <CreateProjectDialog 
        open={open}
        onOpenChange={setOpen}
        onSuccess={async () => {
          setOpen(false);
          await fetchProjects();
        }}
      />
    </>
  );
}