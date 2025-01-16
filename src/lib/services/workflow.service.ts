import { createClient } from "@supabase/supabase-js";
import { sendNotification } from "../utils/notifications";

interface WorkflowState {
  currentStep: string | null;
  stepsCompleted: string[];
  nextSteps: string[];
  blockers: string[];
  lastUpdated: Date;
}

interface WorkflowConfig {
  templateId: string;
  entityId: string;
  entityType: "client" | "project";
  serviceType: string;
  customConfig?: Record<string, any>;
}

export class WorkflowService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

  async initializeWorkflow(config: WorkflowConfig): Promise<WorkflowState> {
    try {
      const { data: template, error: templateError } = await this.supabase
        .from("workflow_templates")
        .select("*")
        .eq("id", config.templateId)
        .single();

      if (templateError || !template) {
        throw new Error(`Workflow template not found: ${config.templateId}`);
      }

      const initialState: WorkflowState = {
        currentStep: template.steps[0]?.id || null,
        stepsCompleted: [],
        nextSteps: template.steps.map((step: any) => step.id),
        blockers: [],
        lastUpdated: new Date(),
      };

      const tableName = config.entityType === "client" ? "clients" : "projects";
      const { error: updateError } = await this.supabase
        .from(tableName)
        .update({
          workflow_state: initialState,
          template_data: template,
          automation_config: config.customConfig || {},
        })
        .eq("id", config.entityId);

      if (updateError) {
        throw new Error(
          `Failed to initialize workflow state for ${config.entityType}`,
        );
      }

      return initialState;
    } catch (error) {
      console.error("Error initializing workflow:", error);
      throw error;
    }
  }

  async advanceWorkflow(
    entityId: string,
    entityType: "client" | "project",
  ): Promise<WorkflowState> {
    try {
      const tableName = entityType === "client" ? "clients" : "projects";
      const { data: entity, error: fetchError } = await this.supabase
        .from(tableName)
        .select("*, workflow_state, template_data")
        .eq("id", entityId)
        .single();

      if (fetchError || !entity) {
        throw new Error(`Entity not found: ${entityId}`);
      }

      const currentState: WorkflowState = entity.workflow_state;
      const template = entity.template_data;

      if (!currentState.currentStep) {
        throw new Error("Workflow not properly initialized");
      }

      const currentStepIndex = template.steps.findIndex(
        (step: any) => step.id === currentState.currentStep,
      );

      if (currentStepIndex === -1) {
        throw new Error("Invalid workflow state");
      }

      const nextStep = template.steps[currentStepIndex + 1];
      if (!nextStep) {
        return this.completeWorkflow(entityId, entityType, currentState);
      }

      const updatedState: WorkflowState = {
        ...currentState,
        currentStep: nextStep.id,
        stepsCompleted: [
          ...currentState.stepsCompleted,
          currentState.currentStep,
        ],
        nextSteps: template.steps
          .slice(currentStepIndex + 1)
          .map((step: any) => step.id),
        lastUpdated: new Date(),
      };

      const { error: updateError } = await this.supabase
        .from(tableName)
        .update({ workflow_state: updatedState })
        .eq("id", entityId);

      if (updateError) {
        throw new Error("Failed to update workflow state");
      }

      return updatedState;
    } catch (error) {
      console.error("Error advancing workflow:", error);
      throw error;
    }
  }

  async checkWorkflowStatus(
    entityId: string,
    entityType: "client" | "project",
  ): Promise<{
    isBlocked: boolean;
    blockers: string[];
    currentStep: string | null;
  }> {
    try {
      const tableName = entityType === "client" ? "clients" : "projects";
      const { data: entity, error } = await this.supabase
        .from(tableName)
        .select("workflow_state, template_data")
        .eq("id", entityId)
        .single();

      if (error || !entity) {
        throw new Error(`Failed to fetch entity: ${entityId}`);
      }

      const state: WorkflowState = entity.workflow_state;
      const template = entity.template_data;

      const currentStep = template.steps.find(
        (step: any) => step.id === state.currentStep,
      );

      if (!currentStep) {
        return { isBlocked: false, blockers: [], currentStep: null };
      }

      const blockers = await this.validateStepRequirements(
        entityId,
        entityType,
        currentStep,
      );

      return {
        isBlocked: blockers.length > 0,
        blockers,
        currentStep: state.currentStep,
      };
    } catch (error) {
      console.error("Error checking workflow status:", error);
      throw error;
    }
  }

  private async validateStepRequirements(
    entityId: string,
    entityType: "client" | "project",
    step: any,
  ): Promise<string[]> {
    const blockers: string[] = [];

    if (step.requiredDocuments) {
      const { data: documents } = await this.supabase
        .from("documents")
        .select("*")
        .eq(entityType + "_id", entityId);

      const missingDocs = step.requiredDocuments.filter(
        (docType: string) =>
          !documents?.some(
            (doc) =>
              doc.category === docType &&
              doc.verification_status === "verified",
          ),
      );

      if (missingDocs.length > 0) {
        blockers.push(`Missing required documents: ${missingDocs.join(", ")}`);
      }
    }

    return blockers;
  }

  private async completeWorkflow(
    entityId: string,
    entityType: "client" | "project",
    currentState: WorkflowState,
  ): Promise<WorkflowState> {
    const completedState: WorkflowState = {
      ...currentState,
      currentStep: null,
      stepsCompleted: [
        ...currentState.stepsCompleted,
        currentState.currentStep!,
      ],
      nextSteps: [],
      blockers: [],
      lastUpdated: new Date(),
    };

    const tableName = entityType === "client" ? "clients" : "projects";
    await this.supabase
      .from(tableName)
      .update({ workflow_state: completedState })
      .eq("id", entityId);

    return completedState;
  }
}
