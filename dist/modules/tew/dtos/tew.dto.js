"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOfflineActivityRecordDto = exports.createStudentHomeworkOverrideDto = exports.teacherAssignedTaskListQueryDto = exports.createTeacherAssignedTaskDto = exports.updateWeeklyReviewDto = exports.createWeeklyReviewDto = void 0;
const zod_1 = require("zod");
exports.createWeeklyReviewDto = zod_1.z.object({
    student_user_id: zod_1.z.string().min(1),
    course_week_id: zod_1.z.string().min(1),
    overall_comment: zod_1.z.string().optional(),
    knowledge_comment: zod_1.z.string().optional(),
    skill_comment: zod_1.z.string().optional(),
    attitude_comment: zod_1.z.string().optional(),
    scores: zod_1.z.array(zod_1.z.object({
        score_type: zod_1.z.enum([
            "lesson_score",
            "homework_score",
            "class_test_score",
            "periodic_exam_score",
            "overall_score"
        ]),
        score_value: zod_1.z.number().min(0),
        max_score: zod_1.z.number().min(0).optional()
    })).optional(),
    comments: zod_1.z.array(zod_1.z.object({
        comment_type: zod_1.z.enum([
            "lesson_comment",
            "homework_comment",
            "class_test_comment",
            "periodic_exam_comment",
            "overall_comment",
            "knowledge_comment",
            "skill_comment",
            "attitude_comment"
        ]),
        comment_text: zod_1.z.string().min(1)
    })).optional()
});
exports.updateWeeklyReviewDto = zod_1.z.object({
    overall_comment: zod_1.z.string().optional(),
    knowledge_comment: zod_1.z.string().optional(),
    skill_comment: zod_1.z.string().optional(),
    attitude_comment: zod_1.z.string().optional(),
    scores: zod_1.z.array(zod_1.z.object({
        score_type: zod_1.z.enum([
            "lesson_score",
            "homework_score",
            "class_test_score",
            "periodic_exam_score",
            "overall_score"
        ]),
        score_value: zod_1.z.number().min(0),
        max_score: zod_1.z.number().min(0).optional()
    })).optional(),
    comments: zod_1.z.array(zod_1.z.object({
        comment_type: zod_1.z.enum([
            "lesson_comment",
            "homework_comment",
            "class_test_comment",
            "periodic_exam_comment",
            "overall_comment",
            "knowledge_comment",
            "skill_comment",
            "attitude_comment"
        ]),
        comment_text: zod_1.z.string().min(1)
    })).optional()
});
exports.createTeacherAssignedTaskDto = zod_1.z.object({
    weekly_review_id: zod_1.z.string().optional(),
    student_user_id: zod_1.z.string().min(1),
    parent_user_id: zod_1.z.string().min(1),
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    due_at: zod_1.z.string().optional(),
    status: zod_1.z.enum(["pending", "in_progress", "completed", "cancelled", "expired"]).optional()
});
exports.teacherAssignedTaskListQueryDto = zod_1.z.object({
    teacher_user_id: zod_1.z.string().optional(),
    student_user_id: zod_1.z.string().optional(),
    parent_user_id: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional()
});
exports.createStudentHomeworkOverrideDto = zod_1.z.object({
    student_user_id: zod_1.z.string().min(1),
    homework_sheet_id: zod_1.z.string().min(1),
    extra_instruction: zod_1.z.string().optional(),
    attachment_file_id: zod_1.z.string().optional()
});
exports.createOfflineActivityRecordDto = zod_1.z.object({
    class_id: zod_1.z.string().min(1),
    course_week_id: zod_1.z.string().min(1),
    student_user_id: zod_1.z.string().min(1),
    activity_type: zod_1.z.string().min(1),
    score: zod_1.z.number().min(0).optional(),
    comment: zod_1.z.string().optional()
});
