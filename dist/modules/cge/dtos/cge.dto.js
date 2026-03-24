"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveJoinRequestDto = exports.createJoinRequestDto = exports.inviteMembersDto = exports.groupListQueryDto = exports.updateGroupDto = exports.createGroupDto = exports.enrollmentListQueryDto = exports.createEnrollmentDto = exports.assignTeacherToClassDto = exports.createClassDto = void 0;
const zod_1 = require("zod");
exports.createClassDto = zod_1.z.object({
    course_id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    start_date: zod_1.z.string().optional(),
    end_date: zod_1.z.string().optional()
});
exports.assignTeacherToClassDto = zod_1.z.object({
    teacher_user_id: zod_1.z.string().min(1),
    role_in_class: zod_1.z.string().min(1)
});
exports.createEnrollmentDto = zod_1.z.object({
    course_id: zod_1.z.string().min(1),
    class_id: zod_1.z.string().optional(),
    student_user_id: zod_1.z.string().min(1),
    enrollment_status: zod_1.z.enum(["active", "inactive", "pending", "cancelled"]).optional()
});
exports.enrollmentListQueryDto = zod_1.z.object({
    course_id: zod_1.z.string().optional(),
    class_id: zod_1.z.string().optional(),
    student_user_id: zod_1.z.string().optional(),
    enrollment_status: zod_1.z.string().optional(),
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional()
});
exports.createGroupDto = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    owner_type: zod_1.z.enum(["student", "teacher", "parent"]),
    visibility: zod_1.z.enum(["private", "invite_only", "public"]).optional(),
    avatar_file_id: zod_1.z.string().optional(),
    status: zod_1.z.enum(["active", "inactive", "archived"]).optional()
});
exports.updateGroupDto = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    description: zod_1.z.string().optional(),
    visibility: zod_1.z.enum(["private", "invite_only", "public"]).optional(),
    avatar_file_id: zod_1.z.string().optional(),
    status: zod_1.z.enum(["active", "inactive", "archived"]).optional()
});
exports.groupListQueryDto = zod_1.z.object({
    owner_user_id: zod_1.z.string().optional(),
    member_user_id: zod_1.z.string().optional(),
    owner_type: zod_1.z.enum(["student", "teacher", "parent"]).optional(),
    keyword: zod_1.z.string().optional(),
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional()
});
exports.inviteMembersDto = zod_1.z.object({
    user_ids: zod_1.z.array(zod_1.z.string().min(1)).min(1)
});
exports.createJoinRequestDto = zod_1.z.object({
    message: zod_1.z.string().optional()
});
exports.approveJoinRequestDto = zod_1.z.object({
    member_role: zod_1.z.enum(["owner", "admin", "member"]).optional()
});
