export type WeeklyReviewScoreType =
  | "lesson_score"
  | "homework_score"
  | "class_test_score"
  | "periodic_exam_score"
  | "overall_score";

export type WeeklyReviewCommentType =
  | "lesson_comment"
  | "homework_comment"
  | "class_test_comment"
  | "periodic_exam_comment"
  | "overall_comment"
  | "knowledge_comment"
  | "skill_comment"
  | "attitude_comment";

export type TeacherAssignedTaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "expired";

export interface WeeklyReview {
  id: string;
  student_user_id: string;
  course_week_id: string;
  teacher_user_id: string;
  overall_comment: string | null;
  knowledge_comment: string | null;
  skill_comment: string | null;
  attitude_comment: string | null;
  created_at: Date;
}

export interface WeeklyReviewScore {
  id: string;
  weekly_review_id: string;
  score_type: WeeklyReviewScoreType;
  score_value: number;
  max_score: number | null;
}

export interface WeeklyReviewComment {
  id: string;
  weekly_review_id: string;
  comment_type: WeeklyReviewCommentType;
  comment_text: string;
}

export interface TeacherAssignedTask {
  id: string;
  weekly_review_id: string | null;
  student_user_id: string;
  parent_user_id: string;
  title: string;
  description: string | null;
  due_at: Date | null;
  status: TeacherAssignedTaskStatus;
  created_at: Date;
}

export interface StudentHomeworkOverride {
  id: string;
  student_user_id: string;
  homework_sheet_id: string;
  extra_instruction: string | null;
  attachment_file_id: string | null;
  created_by: string;
  created_at: Date;
}

export interface OfflineActivityRecord {
  id: string;
  class_id: string;
  course_week_id: string;
  student_user_id: string;
  activity_type: string;
  score: number | null;
  comment: string | null;
  recorded_by: string;
  recorded_at: Date;
}
