"use client";

import { AuthButton } from "./auth-button";

export function AuthButtons() {
  return (
    <div className="flex gap-4">
      <AuthButton type="sign-in" />
      <AuthButton type="sign-up" />
    </div>
  );
}
