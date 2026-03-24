import { z } from "zod";

const roleEnum = z.enum(["student", "parent", "teacher", "admin"]);

export const registerDto = z.object({
  full_name: z.string().min(2),
  display_name: z.string().min(1),

  email: z.string().email().optional(),
  phone: z.string().min(8).optional(),
  password: z.string().min(6),

  role_code: roleEnum.optional(),
  role: roleEnum.optional(),

  avatar_url: z.string().url().optional(),
  slogen: z.string().max(255).optional()
}).refine((data) => data.role_code || data.role, {
  message: "role_code or role is required",
  path: ["role_code"]
});

export const loginDto = z
  .object({
    email_or_phone: z.string().min(3).optional(),
    identifier: z.string().min(3).optional(),
    password: z.string().min(6)
  })
  .refine((data) => !!(data.email_or_phone || data.identifier), {
    message: "email_or_phone or identifier is required",
    path: ["email_or_phone"]
  })
  .transform((data) => ({
    email_or_phone: data.email_or_phone ?? data.identifier ?? "",
    password: data.password
  }));

export const passwordResetRequestDto = z
  .object({
    email_or_phone: z.string().min(3).optional(),
    identifier: z.string().min(3).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(8).optional()
  })
  .refine(
    (data) =>
      !!(data.email_or_phone || data.identifier || data.email || data.phone),
    {
      message: "email_or_phone, identifier, email, or phone is required",
      path: ["email_or_phone"]
    }
  )
  .transform((data) => ({
    email_or_phone:
      data.email_or_phone ?? data.identifier ?? data.email ?? data.phone ?? ""
  }));

export const passwordResetVerifyDto = z.object({
  request_id: z.string().min(1),
  otp_code: z.string().min(4)
});

export const passwordResetConfirmDto = z.object({
  reset_token: z.string().min(1),
  new_password: z.string().min(6)
});

export const updateProfileDto = z.object({
  full_name: z.string().min(2).optional(),
  display_name: z.string().optional(),
  avatar_url: z.string().url().optional(),
  gender: z.string().optional(),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  province_code: z.string().optional(),
  school_name: z.string().optional(),
  grade: z.string().optional(),
  bio: z.string().optional(),
  slogen: z.string().max(255).optional()
});

export const revokeSessionDto = z.object({
  session_id: z.coerce.number().int().positive()
});