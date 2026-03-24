export type ParentTaskStatus = "pending" | "in_progress" | "completed";

export interface WeeklySummary {
  student_user_id: string;
  course_week_id: string;
  completion_rate: number;
  total_score: number;
  ranking: number | null;
  teacher_comment: string | null;
}

export interface ParentTask {
  id: string;
  student_user_id: string;
  parent_user_id: string;
  title: string;
  description: string | null;
  status: ParentTaskStatus;
  created_at: Date;
  completed_at: Date | null;
}
