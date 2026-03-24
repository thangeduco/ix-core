"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseListQueryDto = exports.createHomeworkDto = exports.createQuizDto = exports.createLessonDto = exports.createCourseWeekDto = exports.updateCourseDto = exports.createCourseDto = void 0;
const zod_1 = require("zod");
exports.createCourseDto = zod_1.z.object({
    code: zod_1.z.string().min(2),
    name: zod_1.z.string().min(2),
    subject: zod_1.z.string().min(2),
    grade_level: zod_1.z.string().min(1),
    course_type: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["draft", "published", "archived"]).optional(),
    thumbnail_file_id: zod_1.z.string().optional()
});
exports.updateCourseDto = zod_1.z.object({
    code: zod_1.z.string().min(2).optional(),
    name: zod_1.z.string().min(2).optional(),
    subject: zod_1.z.string().min(2).optional(),
    grade_level: zod_1.z.string().min(1).optional(),
    course_type: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["draft", "published", "archived"]).optional(),
    thumbnail_file_id: zod_1.z.string().optional()
});
exports.createCourseWeekDto = zod_1.z.object({
    week_no: zod_1.z.number().int().positive(),
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    start_date: zod_1.z.string().optional(),
    end_date: zod_1.z.string().optional(),
    status: zod_1.z.string().optional()
});
exports.createLessonDto = zod_1.z.object({
    title: zod_1.z.string().min(2),
    lesson_type: zod_1.z.enum(["video", "reading", "live", "other"]),
    display_order: zod_1.z.number().int().positive(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.string().optional()
});
exports.createQuizDto = zod_1.z.object({
    title: zod_1.z.string().min(2),
    quiz_type: zod_1.z.enum(["weekly_quiz", "practice_quiz", "mock_test"]),
    time_limit_minutes: zod_1.z.number().int().positive().optional(),
    max_attempts: zod_1.z.number().int().positive().optional(),
    passing_score: zod_1.z.number().optional(),
    status: zod_1.z.string().optional()
});
exports.createHomeworkDto = zod_1.z.object({
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    attachment_file_id: zod_1.z.string().optional(),
    due_at: zod_1.z.string().optional(),
    status: zod_1.z.string().optional()
});
exports.courseListQueryDto = zod_1.z.object({
    subject: zod_1.z.string().optional(),
    grade_level: zod_1.z.string().optional(),
    course_type: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    keyword: zod_1.z.string().optional(),
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional()
});
