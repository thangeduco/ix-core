import { z } from "zod";

export const createWeeklyReviewDto = z.object({
  student_user_id: z.string().min(1),
  course_week_id: z.string().min(1),
  overall_comment: z.string().optional(),
  knowledge_comment: z.string().optional(),
  skill_comment: z.string().optional(),
  attitude_comment: z.string().optional(),
  scores: z.array(
    z.object({
      score_type: z.enum([
        "lesson_score",
        "homework_score",
        "class_test_score",
        "periodic_exam_score",
        "overall_score"
      ]),
      score_value: z.number().min(0),
      max_score: z.number().min(0).optional()
    })
  ).optional(),
  comments: z.array(
    z.object({
      comment_type: z.enum([
        "lesson_comment",
        "homework_comment",
        "class_test_comment",
        "periodic_exam_comment",
        "overall_comment",
        "knowledge_comment",
        "skill_comment",
        "attitude_comment"
      ]),
      comment_text: z.string().min(1)
    })
  ).optional()
});

export const updateWeeklyReviewDto = z.object({
  overall_comment: z.string().optional(),
  knowledge_comment: z.string().optional(),
  skill_comment: z.string().optional(),
  attitude_comment: z.string().optional(),
  scores: z.array(
    z.object({
      score_type: z.enum([
        "lesson_score",
        "homework_score",
        "class_test_score",
        "periodic_exam_score",
        "overall_score"
      ]),
      score_value: z.number().min(0),
      max_score: z.number().min(0).optional()
    })
  ).optional(),
  comments: z.array(
    z.object({
      comment_type: z.enum([
        "lesson_comment",
        "homework_comment",
        "class_test_comment",
        "periodic_exam_comment",
        "overall_comment",
        "knowledge_comment",
        "skill_comment",
        "attitude_comment"
      ]),
      comment_text: z.string().min(1)
    })
  ).optional()
});

export const createTeacherAssignedTaskDto = z.object({
  weekly_review_id: z.string().optional(),
  student_user_id: z.string().min(1),
  parent_user_id: z.string().min(1),
  title: z.string().min(2),
  description: z.string().optional(),
  due_at: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled", "expired"]).optional()
});

export const teacherAssignedTaskListQueryDto = z.object({
  teacher_user_id: z.string().optional(),
  student_user_id: z.string().optional(),
  parent_user_id: z.string().optional(),
  status: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

export const createStudentHomeworkOverrideDto = z.object({
  student_user_id: z.string().min(1),
  homework_sheet_id: z.string().min(1),
  extra_instruction: z.string().optional(),
  attachment_file_id: z.string().optional()
});

export const createOfflineActivityRecordDto = z.object({
  class_id: z.string().min(1),
  course_week_id: z.string().min(1),
  student_user_id: z.string().min(1),
  activity_type: z.string().min(1),
  score: z.number().min(0).optional(),
  comment: z.string().optional()
});
