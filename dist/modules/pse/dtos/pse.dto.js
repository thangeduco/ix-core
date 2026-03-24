"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParentTaskDto = exports.parentTaskUpdateDto = exports.weeklyTaskQueryDto = void 0;
const zod_1 = require("zod");
exports.weeklyTaskQueryDto = zod_1.z.object({
    student_user_id: zod_1.z.string().min(1),
    week_id: zod_1.z.string().min(1)
});
exports.parentTaskUpdateDto = zod_1.z.object({
    status: zod_1.z.enum(["pending", "in_progress", "completed"])
});
exports.createParentTaskDto = zod_1.z.object({
    student_user_id: zod_1.z.string().min(1),
    parent_user_id: zod_1.z.string().min(1),
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().optional()
});
