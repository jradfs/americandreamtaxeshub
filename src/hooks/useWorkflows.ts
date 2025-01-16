import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Workflow, WorkflowStatus } from "@/types";
import { supabaseBrowserClient as supabase } from "@/lib/supabaseBrowserClient";

const WORKFLOWS_KEY = "workflows";

export const useWorkflows = () => {
  const queryClient = useQueryClient();

  const fetchWorkflows = async (): Promise<Workflow[]> => {
    const { data, error } = await supabase
      .from("workflows")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  };

  const createWorkflow = async (
    workflow: Omit<Workflow, "id" | "created_at" | "updated_at">,
  ) => {
    const { data, error } = await supabase
      .from("workflows")
      .insert(workflow)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateWorkflow = async (workflow: Workflow) => {
    const { data, error } = await supabase
      .from("workflows")
      .update(workflow)
      .eq("id", workflow.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const changeWorkflowStatus = async (id: string, status: WorkflowStatus) => {
    const { data, error } = await supabase
      .from("workflows")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteWorkflow = async (id: string) => {
    const { error } = await supabase.from("workflows").delete().eq("id", id);

    if (error) throw error;
  };

  const useWorkflowsQuery = () =>
    useQuery({
      queryKey: [WORKFLOWS_KEY],
      queryFn: fetchWorkflows,
    });

  const useCreateWorkflow = () =>
    useMutation({
      mutationFn: createWorkflow,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY] });
      },
    });

  const useUpdateWorkflow = () =>
    useMutation({
      mutationFn: updateWorkflow,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY] });
      },
    });

  const useChangeWorkflowStatus = () =>
    useMutation({
      mutationFn: ({ id, status }: { id: string; status: WorkflowStatus }) =>
        changeWorkflowStatus(id, status),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY] });
      },
    });

  const useDeleteWorkflow = () =>
    useMutation({
      mutationFn: deleteWorkflow,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY] });
      },
    });

  return {
    useWorkflowsQuery,
    useCreateWorkflow,
    useUpdateWorkflow,
    useChangeWorkflowStatus,
    useDeleteWorkflow,
  };
};
