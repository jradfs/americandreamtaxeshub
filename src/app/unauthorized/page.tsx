"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Access Denied</h1>
          <p className="text-lg text-muted-foreground">
            You do not have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </p>
          <div className="flex flex-col space-y-4">
            <Button onClick={handleBack} variant="outline">
              Go Back
            </Button>
            <Button onClick={handleSignOut} variant="destructive">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
