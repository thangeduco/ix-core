"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lsmTeacherEvaluateVideoDto = exports.lsmSubmitVideoQuizDto = exports.lsmAnswerVideoQuizDto = exports.lsmCloseVideoQuizEventDto = exports.lsmOpenVideoQuizEventDto = exports.lsmEndVideoSessionDto = exports.lsmVideoPlaybackRateDto = exports.lsmVideoSeekDto = exports.lsmVideoResumeDto = exports.lsmVideoPauseDto = exports.lsmVideoHeartbeatDto = exports.lsmStartVideoSessionDto = exports.lsmTeacherVideoEvaluationListQueryDto = exports.lsmTeacherVideoEvaluationQueryDto = exports.lsmVideoSessionLogParamsDto = exports.lsmVideoProgressParamsDto = exports.lsmVideoLectureTaskParamsDto = exports.studentTaskContentParamsDto = exports.studentClassWeekParamsDto = exports.studentClassParamsDto = exports.classCodeWeekNoParamsDto = exports.classCodeParamsDto = exports.recentQueryDto = exports.classIdParamsDto = exports.studentIdParamsDto = void 0;
const zod_1 = require("zod");
exports.studentIdParamsDto = zod_1.z.object({
    studentId: zod_1.z.string().min(1, "studentId is required")
});
exports.classIdParamsDto = zod_1.z.object({
    classId: zod_1.z.string().min(1, "classId is required")
});
exports.recentQueryDto = zod_1.z.object({
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(10)
});
exports.classCodeParamsDto = zod_1.z.object({
    classCode: zod_1.z.string().min(1, "classCode is required")
});
exports.classCodeWeekNoParamsDto = zod_1.z.object({
    classCode: zod_1.z.string().min(1, "classCode is required"),
    weekNo: zod_1.z.coerce.number().int().min(1, "weekNo must be >= 1")
});
exports.studentClassParamsDto = zod_1.z.object({
    studentId: zod_1.z.string().min(1, "studentId is required"),
    classCode: zod_1.z.string().min(1, "classCode is required")
});
exports.studentClassWeekParamsDto = zod_1.z.object({
    studentId: zod_1.z.string().min(1, "studentId is required"),
    classCode: zod_1.z.string().min(1, "classCode is required"),
    weekNo: zod_1.z.coerce.number().int().min(1, "weekNo must be >= 1")
});
exports.studentTaskContentParamsDto = zod_1.z.object({
    studentId: zod_1.z.string().min(1, "studentId is required"),
    classCode: zod_1.z.string().min(1, "classCode is required"),
    taskCode: zod_1.z.string().min(1, "taskCode is required")
});
exports.lsmVideoLectureTaskParamsDto = zod_1.z.object({
    studentId: zod_1.z.string().min(1, "studentId is required"),
    classCode: zod_1.z.string().min(1, "classCode is required"),
    taskCode: zod_1.z.string().min(1, "taskCode is required")
});
exports.lsmVideoProgressParamsDto = zod_1.z.object({
    studentId: zod_1.z.string().min(1, "studentId is required"),
    studentWeekLearningItemId: zod_1.z.string().min(1, "studentWeekLearningItemId is required")
});
exports.lsmVideoSessionLogParamsDto = zod_1.z.object({
    studentVideoSessionId: zod_1.z.string().min(1, "studentVideoSessionId is required")
});
exports.lsmTeacherVideoEvaluationQueryDto = zod_1.z.object({
    teacherId: zod_1.z.string().min(1, "teacherId is required"),
    studentId: zod_1.z.string().min(1, "studentId is required"),
    studentWeekLearningItemId: zod_1.z.string().min(1, "studentWeekLearningItemId is required")
});
exports.lsmTeacherVideoEvaluationListQueryDto = zod_1.z.object({
    teacherId: zod_1.z.string().min(1, "teacherId is required"),
    classId: zod_1.z.string().min(1, "classId is required").optional(),
    weekId: zod_1.z.string().min(1, "weekId is required").optional(),
    lectureVideoId: zod_1.z.string().min(1, "lectureVideoId is required").optional(),
    status: zod_1.z.string().min(1).optional()
});
exports.lsmStartVideoSessionDto = zod_1.z.object({
    student_id: zod_1.z.string().min(1),
    student_week_learning_item_id: zod_1.z.string().min(1),
    class_lecture_video_id: zod_1.z.string().min(1).optional().nullable(),
    lecture_video_id: zod_1.z.string().min(1),
    source_assignment_type: zod_1.z.string().min(1),
    start_second: zod_1.z.coerce.number().int().min(0),
    device_type: zod_1.z.string().min(1).optional().default("unknown"),
    app_platform: zod_1.z.string().min(1).optional().default("web"),
    playback_rate: zod_1.z.coerce.number().positive().optional().default(1)
});
exports.lsmVideoHeartbeatDto = zod_1.z.object({
    student_video_session_id: zod_1.z.string().min(1),
    student_id: zod_1.z.string().min(1),
    student_week_learning_item_id: zod_1.z.string().min(1),
    lecture_video_id: zod_1.z.string().min(1),
    current_second: zod_1.z.coerce.number().int().min(0),
    watched_from_second: zod_1.z.coerce.number().int().min(0),
    watched_to_second: zod_1.z.coerce.number().int().min(0),
    playback_rate: zod_1.z.coerce.number().positive().optional().default(1),
    event_time: zod_1.z.string().datetime().optional().nullable()
});
exports.lsmVideoPauseDto = zod_1.z.object({
    student_video_session_id: zod_1.z.string().min(1),
    student_id: zod_1.z.string().min(1),
    current_second: zod_1.z.coerce.number().int().min(0),
    playback_rate: zod_1.z.coerce.number().positive().optional().default(1),
    event_time: zod_1.z.string().datetime().optional().nullable()
});
exports.lsmVideoResumeDto = zod_1.z.object({
    student_video_session_id: zod_1.z.string().min(1),
    student_id: zod_1.z.string().min(1),
    resume_second: zod_1.z.coerce.number().int().min(0),
    playback_rate: zod_1.z.coerce.number().positive().optional().default(1),
    event_time: zod_1.z.string().datetime().optional().nullable()
});
exports.lsmVideoSeekDto = zod_1.z.object({
    student_video_session_id: zod_1.z.string().min(1),
    student_id: zod_1.z.string().min(1),
    from_second: zod_1.z.coerce.number().int().min(0),
    to_second: zod_1.z.coerce.number().int().min(0),
    event_time: zod_1.z.string().datetime().optional().nullable()
});
exports.lsmVideoPlaybackRateDto = zod_1.z.object({
    student_video_session_id: zod_1.z.string().min(1),
    student_id: zod_1.z.string().min(1),
    from_rate: zod_1.z.coerce.number().positive(),
    to_rate: zod_1.z.coerce.number().positive(),
    current_second: zod_1.z.coerce.number().int().min(0),
    event_time: zod_1.z.string().datetime().optional().nullable()
});
exports.lsmEndVideoSessionDto = zod_1.z.object({
    student_video_session_id: zod_1.z.string().min(1),
    student_id: zod_1.z.string().min(1),
    student_week_learning_item_id: zod_1.z.string().min(1),
    lecture_video_id: zod_1.z.string().min(1),
    end_second: zod_1.z.coerce.number().int().min(0),
    watched_duration_second: zod_1.z.coerce.number().int().min(0),
    ended_at: zod_1.z.string().datetime().optional().nullable()
});
exports.lsmOpenVideoQuizEventDto = zod_1.z.object({
    student_video_session_id: zod_1.z.string().min(1),
    student_id: zod_1.z.string().min(1),
    student_week_learning_item_id: zod_1.z.string().min(1),
    lecture_video_id: zod_1.z.string().min(1),
    video_quiz_event_id: zod_1.z.string().min(1),
    trigger_second: zod_1.z.coerce.number().int().min(0),
    opened_at: zod_1.z.string().datetime().optional().nullable()
});
exports.lsmCloseVideoQuizEventDto = zod_1.z.object({
    student_video_session_id: zod_1.z.string().min(1),
    student_id: zod_1.z.string().min(1),
    student_video_event_attempt_id: zod_1.z.string().min(1),
    video_quiz_event_id: zod_1.z.string().min(1),
    current_second: zod_1.z.coerce.number().int().min(0),
    closed_reason: zod_1.z.string().min(1).optional().default("manual_close")
});
exports.lsmAnswerVideoQuizDto = zod_1.z.object({
    student_id: zod_1.z.string().min(1),
    student_week_learning_item_id: zod_1.z.string().min(1),
    student_video_session_id: zod_1.z.string().min(1),
    student_video_event_attempt_id: zod_1.z.string().min(1),
    lecture_video_id: zod_1.z.string().min(1),
    video_quiz_event_id: zod_1.z.string().min(1),
    question_id: zod_1.z.string().min(1),
    selected_answer: zod_1.z.string().min(1),
    answered_video_second: zod_1.z.coerce.number().int().min(0),
    answered_at: zod_1.z.string().datetime().optional().nullable()
});
exports.lsmSubmitVideoQuizDto = zod_1.z.object({
    student_id: zod_1.z.string().min(1),
    student_week_learning_item_id: zod_1.z.string().min(1),
    student_video_session_id: zod_1.z.string().min(1),
    student_video_event_attempt_id: zod_1.z.string().min(1),
    lecture_video_id: zod_1.z.string().min(1),
    video_quiz_event_id: zod_1.z.string().min(1),
    submitted_at: zod_1.z.string().datetime().optional().nullable()
});
exports.lsmTeacherEvaluateVideoDto = zod_1.z.object({
    teacher_id: zod_1.z.string().min(1),
    student_id: zod_1.z.string().min(1),
    student_week_learning_item_id: zod_1.z.string().min(1),
    lecture_video_id: zod_1.z.string().min(1),
    teacher_manual_score: zod_1.z.coerce.number().min(0).default(0),
    teacher_comment: zod_1.z.string().optional().nullable(),
    sticker_code: zod_1.z.string().optional().nullable(),
    sticker_count: zod_1.z.coerce.number().int().min(0).default(0)
});
