"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareRankingDto = exports.rankingQueryDto = void 0;
const zod_1 = require("zod");
exports.rankingQueryDto = zod_1.z.object({
    scope: zod_1.z.enum(["class", "group", "system"]),
    scope_id: zod_1.z.string().optional(),
    period: zod_1.z.enum(["weekly", "course"]),
    course_id: zod_1.z.string(),
    week_id: zod_1.z.string().optional()
});
exports.compareRankingDto = zod_1.z.object({
    student_user_id: zod_1.z.string(),
    course_id: zod_1.z.string(),
    week_id: zod_1.z.string().optional()
});
