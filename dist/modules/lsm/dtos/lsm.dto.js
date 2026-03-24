"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.learningHistoryQueryDto = exports.createPeriodicExamResultDto = exports.createClassTestResultDto = exports.createClassworkResultDto = exports.createHomeworkSubmissionDto = exports.createQuizAttemptDto = exports.finishVideoSessionDto = exports.startVideoSessionDto = void 0;
const zod_1 = require("zod");
exports.startVideoSessionDto = zod_1.z.object({
    student_user_id: zod_1.z.string().min(1).optional(),
    device_info: zod_1.z.string().optional(),
    start_at: zod_1.z.string().optional()
});
exports.finishVideoSessionDto = zod_1.z.object({
    end_at: zod_1.z.string().optional(),
    watched_seconds: zod_1.z.number().min(0),
    completion_rate: zod_1.z.number().min(0).max(1),
    is_completed: zod_1.z.boolean()
});
exports.createQuizAttemptDto = zod_1.z.object({
    student_user_id: zod_1.z.string().min(1).optional(),
    started_at: zod_1.z.string().optional(),
    submitted_at: zod_1.z.string().optional(),
    answers: zod_1.z.array(zod_1.z.object({
        question_id: zod_1.z.string().min(1),
        selected_option_id: zod_1.z.string().min(1)
    })).min(1)
});
exports.createHomeworkSubmissionDto = zod_1.z.object({
    student_user_id: zod_1.z.string().min(1).optional(),
    submission_note: zod_1.z.string().optional(),
    zip_file_id: zod_1.z.string().optional(),
    file_ids: zod_1.z.array(zod_1.z.string().min(1)).optional()
});
exports.createClassworkResultDto = zod_1.z.object({
    student_user_id: zod_1.z.string().min(1),
    score: zod_1.z.number().min(0),
    teacher_comment: zod_1.z.string().optional()
});
exports.createClassTestResultDto = zod_1.z.object({
    student_user_id: zod_1.z.string().min(1),
    score: zod_1.z.number().min(0),
    teacher_comment: zod_1.z.string().optional()
});
exports.createPeriodicExamResultDto = zod_1.z.object({
    student_user_id: zod_1.z.string().min(1),
    score: zod_1.z.number().min(0),
    rank_in_exam: zod_1.z.number().int().positive().optional()
});
exports.learningHistoryQueryDto = zod_1.z.object({
    week_id: zod_1.z.string().optional(),
    course_id: zod_1.z.string().optional(),
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional()
});
