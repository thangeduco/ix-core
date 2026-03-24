"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeSessionDto = exports.updateProfileDto = exports.passwordResetConfirmDto = exports.passwordResetVerifyDto = exports.passwordResetRequestDto = exports.loginDto = exports.registerDto = void 0;
const zod_1 = require("zod");
const roleEnum = zod_1.z.enum(["student", "parent", "teacher", "admin"]);
exports.registerDto = zod_1.z.object({
    full_name: zod_1.z.string().min(2),
    display_name: zod_1.z.string().min(1),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().min(8).optional(),
    password: zod_1.z.string().min(6),
    role_code: roleEnum.optional(),
    role: roleEnum.optional(),
    avatar_url: zod_1.z.string().url().optional(),
    slogen: zod_1.z.string().max(255).optional()
}).refine((data) => data.role_code || data.role, {
    message: "role_code or role is required",
    path: ["role_code"]
});
exports.loginDto = zod_1.z
    .object({
    email_or_phone: zod_1.z.string().min(3).optional(),
    identifier: zod_1.z.string().min(3).optional(),
    password: zod_1.z.string().min(6)
})
    .refine((data) => !!(data.email_or_phone || data.identifier), {
    message: "email_or_phone or identifier is required",
    path: ["email_or_phone"]
})
    .transform((data) => ({
    email_or_phone: data.email_or_phone ?? data.identifier ?? "",
    password: data.password
}));
exports.passwordResetRequestDto = zod_1.z
    .object({
    email_or_phone: zod_1.z.string().min(3).optional(),
    identifier: zod_1.z.string().min(3).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().min(8).optional()
})
    .refine((data) => !!(data.email_or_phone || data.identifier || data.email || data.phone), {
    message: "email_or_phone, identifier, email, or phone is required",
    path: ["email_or_phone"]
})
    .transform((data) => ({
    email_or_phone: data.email_or_phone ?? data.identifier ?? data.email ?? data.phone ?? ""
}));
exports.passwordResetVerifyDto = zod_1.z.object({
    request_id: zod_1.z.string().min(1),
    otp_code: zod_1.z.string().min(4)
});
exports.passwordResetConfirmDto = zod_1.z.object({
    reset_token: zod_1.z.string().min(1),
    new_password: zod_1.z.string().min(6)
});
exports.updateProfileDto = zod_1.z.object({
    full_name: zod_1.z.string().min(2).optional(),
    display_name: zod_1.z.string().optional(),
    avatar_url: zod_1.z.string().url().optional(),
    gender: zod_1.z.string().optional(),
    date_of_birth: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    province_code: zod_1.z.string().optional(),
    school_name: zod_1.z.string().optional(),
    grade: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    slogen: zod_1.z.string().max(255).optional()
});
exports.revokeSessionDto = zod_1.z.object({
    session_id: zod_1.z.coerce.number().int().positive()
});
