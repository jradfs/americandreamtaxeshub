'use client';

import { useState } from "react";
import { Button } from '@/components/ui/button';
import { PlusCircle } from "lucide-react";
import { ProjectDialog } from "./project-dialog";
import { useProjects } from '@/hooks/useProjects';

export function NewProjectButton() {
  const [open, setOpen] = useState(false);
  const { refreshProjects } = useProjects();

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        New Project
      </Button>
      
      <ProjectDialog 
        open={open}
        onOpenChange={setOpen}
        onSuccess={async () => {
          setOpen(false);
          await refreshProjects();
        }}
      />
    </>
  );
}