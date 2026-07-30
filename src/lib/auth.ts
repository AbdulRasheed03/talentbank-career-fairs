import { z } from "zod";

// ---------------------------------------------------------------------------
// Auth form validation (pure — unit tested). No DB, no crypto here.
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Enter your username."),
  password: z.string().min(1, "Enter your password."),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9_]{3,20}$/,
      "3–20 characters: lowercase letters, numbers or underscore.",
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Enter a valid email address.",
    }),
  password: z.string().min(8, "Use at least 8 characters."),
  attendeeType: z.enum(["candidate", "employer"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};
