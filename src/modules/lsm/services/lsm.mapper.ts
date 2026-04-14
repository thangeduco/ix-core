import {
  LsmClassCourseInfo,
  LsmClassWeekItem,
  LsmStudentClassWeekResultItem,
  LsmStudentTaskFileInfo,
  LsmStudentTaskInfo,
  LsmStudentTaskQuizTestInfo,
  LsmStudentTaskVideoLectureInfo,
  LsmStudentTaskVideoQuizQuestionInfo
} from "../types/lsm.types";

export type LsmStudentWeekRankingItem = {
  week_score_ranking: number | null;
  total_week_stickers_ranking: number | null;
  homework_score_ranking: number | null;
  extra_assignment_score_ranking: number | null;
  preparation_score_ranking: number | null;
  in_class_score_ranking: number | null;
};

export function toNullableNumber(value: any): number | null {
  return value !== null && value !== undefined ? Number(value) : null;
}

export function toClassCourseInfo(row: any): LsmClassCourseInfo | null {
  if (!row) return null;

  return {
    avatar_url: row.avatar_url ?? null,
    class_name: row.class_name ?? null,
    class_code: row.class_code ?? null,
    slogan: row.slogan ?? null
  };
}

export function toClassWeekItem(row: any): LsmClassWeekItem | null {
  if (!row) return null;

  return {
    id: String(row.id),
    week_no: toNullableNumber(row.week_no),
    title: row.title ?? null,
    start_date: row.start_date ?? null,
    end_date: row.end_date ?? null
  };
}

export function toStudentClassWeekResult(
  row: any,
  rankings?: LsmStudentWeekRankingItem | null
): LsmStudentClassWeekResultItem {
  return {
    id: String(row.id),
    student_id: String(row.student_id),
    class_id: String(row.class_id),
    week_id: String(row.week_id),
    class_code: row.class_code ?? null,
    week_no: toNullableNumber(row.week_no),
    teacher_comment: row.teacher_comment ?? null,
    week_score: toNullableNumber(row.week_score),
    week_score_ranking: toNullableNumber(rankings?.week_score_ranking),
    total_week_stickers: toNullableNumber(row.total_week_stickers),
    total_week_stickers_ranking: toNullableNumber(rankings?.total_week_stickers_ranking),
    homework_score: toNullableNumber(row.homework_score),
    homework_score_ranking: toNullableNumber(rankings?.homework_score_ranking),
    homework_stickers: toNullableNumber(row.homework_stickers),
    extra_assignment_score: toNullableNumber(row.extra_assignment_score),
    extra_assignment_score_ranking: toNullableNumber(
      rankings?.extra_assignment_score_ranking
    ),
    extra_assignment_stickers: toNullableNumber(row.extra_assignment_stickers),
    preparation_score: toNullableNumber(row.preparation_score),
    preparation_score_ranking: toNullableNumber(rankings?.preparation_score_ranking),
    preparation_stickers: toNullableNumber(row.preparation_stickers),
    in_class_score: toNullableNumber(row.in_class_score),
    in_class_score_ranking: toNullableNumber(rankings?.in_class_score_ranking),
    in_class_stickers: toNullableNumber(row.in_class_stickers),
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null
  };
}

export function toTaskInfo(row: any): LsmStudentTaskInfo | null {
  if (!row) return null;

  return {
    task_code: String(row.task_code),
    task_title: row.task_title ?? null,
    content_type: row.content_type ?? null
  };
}

export function toLectureVideoInfo(row: any): LsmStudentTaskVideoLectureInfo | null {
  if (!row) return null;

  return {
    id: String(row.id),
    title: row.title ?? null,
    description: row.description ?? null,
    video_url: row.video_url ?? null,
    thumbnail_url: row.thumbnail_url ?? null,
    duration_seconds: toNullableNumber(row.duration_seconds)
  };
}

export function toQuizQuestionInfo(
  row: any
): LsmStudentTaskVideoQuizQuestionInfo | null {
  if (!row) return null;

  return {
    id: String(row.id),
    question_text: row.question_text ?? null,
    question_type: row.question_type ?? null,
    options: row.options ?? null,
    correct_answer: row.correct_answer ?? null,
    explanation: row.explanation ?? null,
    default_score: toNullableNumber(row.default_score),
    difficulty_level: row.difficulty_level ?? null,
    status: row.status ?? null,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null
  };
}

export function toContentFileInfo(row: any): LsmStudentTaskFileInfo | null {
  if (!row) return null;

  return {
    file_url: row.file_url ?? null,
    file_name: row.file_name ?? null
  };
}

export function toQuizTestInfo(row: any): LsmStudentTaskQuizTestInfo | null {
  if (!row) return null;

  return {
    id: String(row.id),
    title: row.title ?? null,
    description: row.description ?? null,
    quiz_type: row.quiz_type ?? null,
    time_limit_minutes: toNullableNumber(row.time_limit_minutes),
    max_attempts: toNullableNumber(row.max_attempts),
    passing_score: toNullableNumber(row.passing_score),
    shuffle_question: Boolean(row.shuffle_question),
    shuffle_option: Boolean(row.shuffle_option)
  };
}