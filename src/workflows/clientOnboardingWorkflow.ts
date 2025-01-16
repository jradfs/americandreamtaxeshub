import { createClient } from "@supabase/supabase-js";
import { sendNotification } from "../utils/notifications";

interface ClientData {
  id: string;
  name: string;
  email: string;
  businessType?: string;
  serviceType: string;
  phone?: string;
  documents?: DocumentData[];
}

interface DocumentData {
  id: string;
  category: string;
  status: string;
  uploadedAt: Date;
}

interface WorkflowStep {
  id: string;
  name: string;
  requiredDocuments?: string[];
  dependencies?: string[];
  automationRules?: Record<string, any>;
  completionCriteria: Record<string, any>;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  serviceType: string;
  steps: WorkflowStep[];
  estimatedDuration: number;
}

interface OnboardingProgress {
  status: "pending" | "in_progress" | "completed" | "blocked";
  completedSteps: string[];
  nextSteps: string[];
  documentsReceived: string[];
  lastUpdated: Date;
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

export async function initOnboardingFlow(
  clientData: ClientData,
): Promise<void> {
  // Validate required fields
  if (
    !clientData.id ||
    !clientData.name ||
    !clientData.email ||
    !clientData.serviceType
  ) {
    throw new Error("Missing required client information");
  }

  try {
    // Fetch workflow template based on service type
    const { data: template, error: templateError } = await supabase
      .from("workflow_templates")
      .select("*")
      .eq("service_type", clientData.serviceType)
      .single();

    if (templateError || !template) {
      throw new Error(
        `No workflow template found for service type: ${clientData.serviceType}`,
      );
    }

    // Initialize onboarding progress
    const initialProgress: OnboardingProgress = {
      status: "pending",
      completedSteps: [],
      nextSteps: template.steps.map((step) => step.id),
      documentsReceived: [],
      lastUpdated: new Date(),
    };

    // Update client with initial progress
    const { error: updateError } = await supabase
      .from("clients")
      .update({
        onboarding_progress: initialProgress,
        document_requirements: template.steps
          .filter((step) => step.requiredDocuments)
          .flatMap((step) => step.requiredDocuments!),
      })
      .eq("id", clientData.id);

    if (updateError) {
      throw new Error("Failed to initialize client onboarding progress");
    }

    // Send welcome notification
    await sendNotification({
      type: "onboarding_welcome",
      recipient: clientData.email,
      data: {
        clientName: clientData.name,
        nextSteps: template.steps[0],
      },
    });

    // Start monitoring progress
    await monitorOnboardingProgress(clientData.id);
  } catch (error) {
    console.error("Error initializing onboarding flow:", error);
    throw error;
  }
}

async function monitorOnboardingProgress(clientId: string): Promise<void> {
  const { data: client, error } = await supabase
    .from("clients")
    .select("*, documents(*)")
    .eq("id", clientId)
    .single();

  if (error || !client) {
    throw new Error("Failed to fetch client data");
  }

  const progress = client.onboarding_progress as OnboardingProgress;
  const documents = client.documents as DocumentData[];

  // Check for completed steps
  for (const stepId of progress.nextSteps) {
    const step = await getWorkflowStep(stepId);
    if (await checkStepCompletion(step, documents, client)) {
      await updateProgress(clientId, stepId);
    }
  }

  // Check for blocked steps
  if (progress.status !== "blocked" && (await checkForBlockers(clientId))) {
    await updateProgressStatus(clientId, "blocked");
    await sendNotification({
      type: "onboarding_blocked",
      recipient: client.email,
      data: {
        clientName: client.name,
        missingItems: await getMissingItems(clientId),
      },
    });
  }
}

async function checkStepCompletion(
  step: WorkflowStep,
  documents: DocumentData[],
  clientData: any,
): Promise<boolean> {
  // Check document requirements
  if (step.requiredDocuments) {
    const hasAllDocuments = step.requiredDocuments.every((docType) =>
      documents.some(
        (doc) => doc.category === docType && doc.status === "verified",
      ),
    );
    if (!hasAllDocuments) return false;
  }

  // Check dependencies
  if (step.dependencies) {
    const allDependenciesMet = step.dependencies.every((depId) =>
      clientData.onboarding_progress.completedSteps.includes(depId),
    );
    if (!allDependenciesMet) return false;
  }

  return true;
}
