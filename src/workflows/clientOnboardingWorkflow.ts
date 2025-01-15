interface ClientData {
  id: string;
  name?: string;
  email?: string;
  // other fields...
}

export async function initOnboardingFlow(clientData: ClientData) {
  // Validate input
  if (!clientData || !clientData.id) {
    throw new Error("Missing required client ID");
  }

  // Existing onboarding logic...
  console.log("Onboarding flow initiated for:", clientData.id);
  // ...
} 