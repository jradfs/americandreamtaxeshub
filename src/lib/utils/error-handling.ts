import { AuthError } from "@supabase/supabase-js";

export const handleSupabaseError = (error: any) => {
  if (error?.code === "42501") {
    console.error("Permission denied error:", error);
    return "You do not have permission to perform this action. Please contact your administrator.";
  }
  return "An unexpected error occurred. Please try again.";
};
