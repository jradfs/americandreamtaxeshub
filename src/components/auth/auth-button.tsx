"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface AuthButtonProps {
  type: "sign-in" | "sign-up";
}

export function AuthButton({ type }: AuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = useCallback(async () => {
    try {
      setLoading(true);
      router.push(`/auth/${type === "sign-in" ? "login" : "signup"}`);
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [type, router, toast]);

  const buttonText = type === "sign-in" ? "Sign In" : "Sign Up";
  const buttonVariant = type === "sign-in" ? "default" : "outline";

  return (
    <Button onClick={handleAuth} disabled={loading} variant={buttonVariant}>
      {loading ? "Loading..." : buttonText}
    </Button>
  );
}
