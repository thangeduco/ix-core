export type SubmissionStatus = "draft" | "submitted" | "late" | "reviewed";
export type WeeklyTaskStatus = "not_started" | "in_progress" | "completed" | "skipped";

export interface StudentWeekProgress {
  id: string;
  student_user_id: string;
  course_week_id: string;
  lesson_completion_rate: number;
  quiz_completion_rate: number;
  homework_completion_rate: number;
  overall_completion_rate: number;
  status: string;
}

export interface VideoLearningSession {
  id: string;
  student_user_id: string;
  lesson_video_id: string;
  start_at: Date;
  end_at: Date | null;
  watched_seconds: number;
  completion_rate: number;
  is_completed: boolean;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_user_id: string;
  attempt_no: number;
  started_at: Date;
  submitted_at: Date | null;
  score: number | null;
  correct_count: number | null;
  status: string;
}

export interface HomeworkSubmission {
  id: string;
  homework_sheet_id: string;
  student_user_id: string;
  submitted_at: Date | null;
  submission_status: SubmissionStatus;
  submission_note: string | null;
  zip_file_id: string | null;
}

export interface WeeklyTaskProgress {
  id: string;
  student_user_id: string;
  course_week_id: string;
  task_type: string;
  target_id: string;
  status: WeeklyTaskStatus;
  completed_at: Date | null;
}
