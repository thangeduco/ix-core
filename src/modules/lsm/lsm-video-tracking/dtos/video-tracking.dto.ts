import { z } from "zod";

// ===== SESSION =====

export const startSessionDto = z.object({
  student_id: z.number(),
  task_id: z.number(),
  task_code: z.string(),
  lecture_video_id: z.number(),
  start_second: z.number(),
  device_type: z.string().optional(),
  app_platform: z.string().optional(),
});

export const heartbeatDto = z.object({
  session_id: z.number(),
  current_second: z.number(),
  playback_rate: z.number().optional()
});

export const pauseDto = z.object({
  session_id: z.number(),
  current_second: z.number()
});

export const resumeDto = z.object({
  session_id: z.number()
});

export const seekDto = z.object({
  session_id: z.number(),
  from_second: z.number(),
  to_second: z.number()
});

export const endDto = z.object({
  session_id: z.number(),
  end_second: z.number()
});

// ===== EVENT =====

export const eventOpenDto = z.object({
  student_id: z.number(),
  task_id: z.number(),
  task_code: z.string(),
  session_id: z.number(),
  lecture_video_id: z.number(),
  video_quiz_event_id: z.number(),
  event_second: z.number()
});

export const eventCloseDto = z.object({
  attempt_id: z.number(),
  event_second: z.number()
});

export const eventAnswerDto = z.object({
  attempt_id: z.number(),
  student_id: z.number(),
  task_id: z.number(),
  task_code: z.string(),
  session_id: z.number(),
  lecture_video_id: z.number(),
  video_quiz_event_id: z.number(),
  question_id: z.number(),
  selected_answer: z.string(),
  is_correct: z.boolean(),
  answered_second: z.number()
});

export const eventSubmitDto = z.object({
  attempt_id: z.number(),
  total_questions: z.number(),
  correct_answers: z.number(),
  score: z.number(),
  is_passed: z.boolean()
});