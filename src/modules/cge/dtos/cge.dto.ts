import { z } from "zod";

export const createClassDto = z.object({
  course_id: z.string().min(1),
  name: z.string().min(2),
  description: z.string().optional(),
  status: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
});

export const assignTeacherToClassDto = z.object({
  teacher_user_id: z.string().min(1),
  role_in_class: z.string().min(1)
});

export const createEnrollmentDto = z.object({
  course_id: z.string().min(1),
  class_id: z.string().optional(),
  student_user_id: z.string().min(1),
  enrollment_status: z.enum(["active", "inactive", "pending", "cancelled"]).optional()
});

export const enrollmentListQueryDto = z.object({
  course_id: z.string().optional(),
  class_id: z.string().optional(),
  student_user_id: z.string().optional(),
  enrollment_status: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

export const createGroupDto = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  owner_type: z.enum(["student", "teacher", "parent"]),
  visibility: z.enum(["private", "invite_only", "public"]).optional(),
  avatar_file_id: z.string().optional(),
  status: z.enum(["active", "inactive", "archived"]).optional()
});

export const updateGroupDto = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  visibility: z.enum(["private", "invite_only", "public"]).optional(),
  avatar_file_id: z.string().optional(),
  status: z.enum(["active", "inactive", "archived"]).optional()
});

export const groupListQueryDto = z.object({
  owner_user_id: z.string().optional(),
  member_user_id: z.string().optional(),
  owner_type: z.enum(["student", "teacher", "parent"]).optional(),
  keyword: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

export const inviteMembersDto = z.object({
  user_ids: z.array(z.string().min(1)).min(1)
});

export const createJoinRequestDto = z.object({
  message: z.string().optional()
});

export const approveJoinRequestDto = z.object({
  member_role: z.enum(["owner", "admin", "member"]).optional()
});
