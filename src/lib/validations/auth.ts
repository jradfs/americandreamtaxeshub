import { z } from "zod";
import { type UserRole } from "@/types/auth";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must not exceed 100 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  );

export const signInSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(254, "Email must not exceed 254 characters"),
  password: passwordSchema,
  remember: z.boolean().optional(),
});

export const signUpSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .min(5, "Email must be at least 5 characters")
      .max(254, "Email must not exceed 254 characters"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Full name can only contain letters, spaces, hyphens, and apostrophes",
      ),
    role: z.enum([
      "admin",
      "team_member",
    ] as const satisfies readonly UserRole[]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(254, "Email must not exceed 254 characters"),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
