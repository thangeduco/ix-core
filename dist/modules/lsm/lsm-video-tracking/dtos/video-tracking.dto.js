"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventSubmitDto = exports.eventAnswerDto = exports.eventCloseDto = exports.eventOpenDto = exports.endDto = exports.seekDto = exports.resumeDto = exports.pauseDto = exports.heartbeatDto = exports.startSessionDto = void 0;
const zod_1 = require("zod");
// ===== SESSION =====
exports.startSessionDto = zod_1.z.object({
    student_id: zod_1.z.number(),
    task_id: zod_1.z.number(),
    task_code: zod_1.z.string(),
    lecture_video_id: zod_1.z.number(),
    start_second: zod_1.z.number(),
    device_type: zod_1.z.string().optional(),
    app_platform: zod_1.z.string().optional(),
});
exports.heartbeatDto = zod_1.z.object({
    session_id: zod_1.z.number(),
    current_second: zod_1.z.number(),
    playback_rate: zod_1.z.number().optional()
});
exports.pauseDto = zod_1.z.object({
    session_id: zod_1.z.number(),
    current_second: zod_1.z.number()
});
exports.resumeDto = zod_1.z.object({
    session_id: zod_1.z.number()
});
exports.seekDto = zod_1.z.object({
    session_id: zod_1.z.number(),
    from_second: zod_1.z.number(),
    to_second: zod_1.z.number()
});
exports.endDto = zod_1.z.object({
    session_id: zod_1.z.number(),
    end_second: zod_1.z.number()
});
// ===== EVENT =====
exports.eventOpenDto = zod_1.z.object({
    student_id: zod_1.z.number(),
    task_id: zod_1.z.number(),
    task_code: zod_1.z.string(),
    session_id: zod_1.z.number(),
    lecture_video_id: zod_1.z.number(),
    video_quiz_event_id: zod_1.z.number(),
    event_second: zod_1.z.number()
});
exports.eventCloseDto = zod_1.z.object({
    attempt_id: zod_1.z.number(),
    event_second: zod_1.z.number()
});
exports.eventAnswerDto = zod_1.z.object({
    attempt_id: zod_1.z.number(),
    student_id: zod_1.z.number(),
    task_id: zod_1.z.number(),
    task_code: zod_1.z.string(),
    session_id: zod_1.z.number(),
    lecture_video_id: zod_1.z.number(),
    video_quiz_event_id: zod_1.z.number(),
    question_id: zod_1.z.number(),
    selected_answer: zod_1.z.string(),
    is_correct: zod_1.z.boolean(),
    answered_second: zod_1.z.number()
});
exports.eventSubmitDto = zod_1.z.object({
    attempt_id: zod_1.z.number(),
    total_questions: zod_1.z.number(),
    correct_answers: zod_1.z.number(),
    score: zod_1.z.number(),
    is_passed: zod_1.z.boolean()
});
