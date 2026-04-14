import { z } from "zod";

export const studentIdParamsDto = z.object({
  studentId: z.string().min(1, "studentId is required")
});

export const classIdParamsDto = z.object({
  classId: z.string().min(1, "classId is required")
});

export const recentQueryDto = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(10)
});

export const classCodeParamsDto = z.object({
  classCode: z.string().min(1, "classCode is required")
});

export const classCodeWeekNoParamsDto = z.object({
  classCode: z.string().min(1, "classCode is required"),
  weekNo: z.coerce.number().int().min(1, "weekNo must be >= 1")
});

export const studentClassParamsDto = z.object({
  studentId: z.string().min(1, "studentId is required"),
  classCode: z.string().min(1, "classCode is required")
});

export const studentClassWeekParamsDto = z.object({
  studentId: z.string().min(1, "studentId is required"),
  classCode: z.string().min(1, "classCode is required"),
  weekNo: z.coerce.number().int().min(1, "weekNo must be >= 1")
});

export const studentTaskContentParamsDto = z.object({
  studentId: z.string().min(1, "studentId is required"),
  classCode: z.string().min(1, "classCode is required"),
  taskCode: z.string().min(1, "taskCode is required")
});

export const lsmVideoLectureTaskParamsDto = z.object({
  studentId: z.string().min(1, "studentId is required"),
  classCode: z.string().min(1, "classCode is required"),
  taskCode: z.string().min(1, "taskCode is required")
});

export const lsmVideoProgressParamsDto = z.object({
  studentId: z.string().min(1, "studentId is required"),
  studentWeekLearningItemId: z.string().min(1, "studentWeekLearningItemId is required")
});

export const lsmVideoSessionLogParamsDto = z.object({
  studentVideoSessionId: z.string().min(1, "studentVideoSessionId is required")
});

export const lsmTeacherVideoEvaluationQueryDto = z.object({
  teacherId: z.string().min(1, "teacherId is required"),
  studentId: z.string().min(1, "studentId is required"),
  studentWeekLearningItemId: z.string().min(1, "studentWeekLearningItemId is required")
});

export const lsmTeacherVideoEvaluationListQueryDto = z.object({
  teacherId: z.string().min(1, "teacherId is required"),
  classId: z.string().min(1, "classId is required").optional(),
  weekId: z.string().min(1, "weekId is required").optional(),
  lectureVideoId: z.string().min(1, "lectureVideoId is required").optional(),
  status: z.string().min(1).optional()
});

export const lsmStartVideoSessionDto = z.object({
  student_id: z.string().min(1),
  student_week_learning_item_id: z.string().min(1),
  class_lecture_video_id: z.string().min(1).optional().nullable(),
  lecture_video_id: z.string().min(1),
  source_assignment_type: z.string().min(1),
  start_second: z.coerce.number().int().min(0),
  device_type: z.string().min(1).optional().default("unknown"),
  app_platform: z.string().min(1).optional().default("web"),
  playback_rate: z.coerce.number().positive().optional().default(1)
});

export const lsmVideoHeartbeatDto = z.object({
  student_video_session_id: z.string().min(1),
  student_id: z.string().min(1),
  student_week_learning_item_id: z.string().min(1),
  lecture_video_id: z.string().min(1),
  current_second: z.coerce.number().int().min(0),
  watched_from_second: z.coerce.number().int().min(0),
  watched_to_second: z.coerce.number().int().min(0),
  playback_rate: z.coerce.number().positive().optional().default(1),
  event_time: z.string().datetime().optional().nullable()
});

export const lsmVideoPauseDto = z.object({
  student_video_session_id: z.string().min(1),
  student_id: z.string().min(1),
  current_second: z.coerce.number().int().min(0),
  playback_rate: z.coerce.number().positive().optional().default(1),
  event_time: z.string().datetime().optional().nullable()
});

export const lsmVideoResumeDto = z.object({
  student_video_session_id: z.string().min(1),
  student_id: z.string().min(1),
  resume_second: z.coerce.number().int().min(0),
  playback_rate: z.coerce.number().positive().optional().default(1),
  event_time: z.string().datetime().optional().nullable()
});

export const lsmVideoSeekDto = z.object({
  student_video_session_id: z.string().min(1),
  student_id: z.string().min(1),
  from_second: z.coerce.number().int().min(0),
  to_second: z.coerce.number().int().min(0),
  event_time: z.string().datetime().optional().nullable()
});

export const lsmVideoPlaybackRateDto = z.object({
  student_video_session_id: z.string().min(1),
  student_id: z.string().min(1),
  from_rate: z.coerce.number().positive(),
  to_rate: z.coerce.number().positive(),
  current_second: z.coerce.number().int().min(0),
  event_time: z.string().datetime().optional().nullable()
});

export const lsmEndVideoSessionDto = z.object({
  student_video_session_id: z.string().min(1),
  student_id: z.string().min(1),
  student_week_learning_item_id: z.string().min(1),
  lecture_video_id: z.string().min(1),
  end_second: z.coerce.number().int().min(0),
  watched_duration_second: z.coerce.number().int().min(0),
  ended_at: z.string().datetime().optional().nullable()
});

export const lsmOpenVideoQuizEventDto = z.object({
  student_video_session_id: z.string().min(1),
  student_id: z.string().min(1),
  student_week_learning_item_id: z.string().min(1),
  lecture_video_id: z.string().min(1),
  video_quiz_event_id: z.string().min(1),
  trigger_second: z.coerce.number().int().min(0),
  opened_at: z.string().datetime().optional().nullable()
});

export const lsmCloseVideoQuizEventDto = z.object({
  student_video_session_id: z.string().min(1),
  student_id: z.string().min(1),
  student_video_event_attempt_id: z.string().min(1),
  video_quiz_event_id: z.string().min(1),
  current_second: z.coerce.number().int().min(0),
  closed_reason: z.string().min(1).optional().default("manual_close")
});

export const lsmAnswerVideoQuizDto = z.object({
  student_id: z.string().min(1),
  student_week_learning_item_id: z.string().min(1),
  student_video_session_id: z.string().min(1),
  student_video_event_attempt_id: z.string().min(1),
  lecture_video_id: z.string().min(1),
  video_quiz_event_id: z.string().min(1),
  question_id: z.string().min(1),
  selected_answer: z.string().min(1),
  answered_video_second: z.coerce.number().int().min(0),
  answered_at: z.string().datetime().optional().nullable()
});

export const lsmSubmitVideoQuizDto = z.object({
  student_id: z.string().min(1),
  student_week_learning_item_id: z.string().min(1),
  student_video_session_id: z.string().min(1),
  student_video_event_attempt_id: z.string().min(1),
  lecture_video_id: z.string().min(1),
  video_quiz_event_id: z.string().min(1),
  submitted_at: z.string().datetime().optional().nullable()
});

export const lsmTeacherEvaluateVideoDto = z.object({
  teacher_id: z.string().min(1),
  student_id: z.string().min(1),
  student_week_learning_item_id: z.string().min(1),
  lecture_video_id: z.string().min(1),
  teacher_manual_score: z.coerce.number().min(0).default(0),
  teacher_comment: z.string().optional().nullable(),
  sticker_code: z.string().optional().nullable(),
  sticker_count: z.coerce.number().int().min(0).default(0)
});