"use client";

import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "./useSupabase";

export type WorkflowMilestone =
  | "documents_requested"
  | "documents_received"
  | "review_started"
  | "review_completed"
  | "client_review"
  | "client_approved"
  | "filed"
  | "accepted"
  | "rejected";

export type WorkflowLog = {
  id: string;
  return_id: string;
  milestone: WorkflowMilestone;
  notes?: string;
  created_at: string;
  created_by: string;
};

export function useWorkflow(returnId: string) {
  const {
    data: logs,
    error,
    mutate,
  } = useSupabase("workflow_logs", {
    filters: [["return_id", "eq", returnId]],
    orderBy: { column: "created_at", ascending: false },
  });
  const { toast } = useToast();

  const updateMilestone = async (
    milestone: WorkflowMilestone,
    notes?: string,
  ) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const { error: logError } = await supabase.from("workflow_logs").insert({
        return_id: returnId,
        milestone,
        notes,
        created_by: session.user.id,
      });

      if (logError) throw logError;

      // Update tax return status based on milestone
      const status = getStatusFromMilestone(milestone);
      if (status) {
        const { error: updateError } = await supabase
          .from("tax_returns")
          .update({ status })
          .eq("id", returnId);

        if (updateError) throw updateError;
      }

      mutate();
      toast({
        title: "Success",
        description: "Workflow updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workflow",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getStatusFromMilestone = (milestone: WorkflowMilestone) => {
    switch (milestone) {
      case "documents_requested":
        return "pending_documents";
      case "documents_received":
        return "ready_for_review";
      case "review_started":
        return "in_review";
      case "review_completed":
        return "pending_approval";
      case "client_approved":
        return "ready_to_file";
      case "filed":
        return "filed";
      case "accepted":
        return "completed";
      case "rejected":
        return "needs_revision";
      default:
        return null;
    }
  };

  const getCurrentMilestone = () => {
    if (!logs?.length) return null;
    return logs[0].milestone;
  };

  const getNextMilestones = () => {
    const current = getCurrentMilestone();
    if (!current) {
      return ["documents_requested"];
    }

    const workflow: { [key in WorkflowMilestone]: WorkflowMilestone[] } = {
      documents_requested: ["documents_received"],
      documents_received: ["review_started"],
      review_started: ["review_completed"],
      review_completed: ["client_review"],
      client_review: ["client_approved", "review_started"],
      client_approved: ["filed"],
      filed: ["accepted", "rejected"],
      accepted: [],
      rejected: ["review_started"],
    };

    return workflow[current] || [];
  };

  return {
    logs,
    error,
    updateMilestone,
    getCurrentMilestone,
    getNextMilestones,
  };
}
