"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/types/database.types";

const schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "team_member"]),
});

export function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient<Database>({
    options: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    },
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "team_member",
    },
  });

  const onSubmit = async (data) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
          },
        },
      });
      if (signUpError) throw signUpError;

      // Create profile record
      const { error: profileError } = await supabase.from("profiles").insert({
        id: (await supabase.auth.getUser()).data.user?.id,
        full_name: data.fullName,
        email: data.email,
        role: data.role,
      });
      if (profileError) throw profileError;

      toast({
        description:
          "Account created successfully! Please check your email to verify your account.",
      });
      router.push("/auth/login");
    } catch (error: any) {
      toast({ description: error.message });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input
        placeholder="Full Name"
        {...form.register("fullName")}
        disabled={form.formState.isSubmitting}
      />
      {form.formState.errors.fullName?.message && (
        <p className="text-sm text-red-500">
          {form.formState.errors.fullName.message}
        </p>
      )}

      <Input
        type="email"
        placeholder="Email"
        {...form.register("email")}
        disabled={form.formState.isSubmitting}
      />
      {form.formState.errors.email?.message && (
        <p className="text-sm text-red-500">
          {form.formState.errors.email.message}
        </p>
      )}

      <Input
        type="password"
        placeholder="Password"
        {...form.register("password")}
        disabled={form.formState.isSubmitting}
      />
      {form.formState.errors.password?.message && (
        <p className="text-sm text-red-500">
          {form.formState.errors.password.message}
        </p>
      )}

      <Select
        onValueChange={(value) =>
          form.setValue("role", value as "admin" | "team_member")
        }
        defaultValue={form.getValues("role")}
        disabled={form.formState.isSubmitting}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="team_member">Team Member</SelectItem>
        </SelectContent>
      </Select>
      {form.formState.errors.role?.message && (
        <p className="text-sm text-red-500">
          {form.formState.errors.role.message}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
