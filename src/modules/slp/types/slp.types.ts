export type RankingScope = "class" | "group" | "system";
export type RankingPeriod = "weekly" | "course";

export interface RankingRecord {
  id: string;
  student_user_id: string;
  scope: RankingScope;
  scope_id: string | null;
  period: RankingPeriod;
  course_id: string;
  course_week_id: string | null;
  rank: number;
  score: number;
  created_at: Date;
}

export interface StudentScoreAggregate {
  student_user_id: string;
  total_score: number;
  lesson_score: number;
  homework_score: number;
  test_score: number;
  exam_score: number;
}
