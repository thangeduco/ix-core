export interface LsmPendingCourseWeekItem {
  class_week_id: string;
  week_no: number | null;
  title: string | null;
  total_student_done: number;
  total_student_assigned: number;
}

export interface LsmStudentCoursePendingItem {
  avatar_url: string | null;
  class_name: string | null;
  class_code: string | null;
  slogan: string | null;
  pending_weeks: LsmPendingCourseWeekItem[];
}

export interface LsmStudentCoursesPendingResponse {
  student_id: string;
  courses: LsmStudentCoursePendingItem[];
}

export interface LsmRecentStudentEventItem {
  event_name: string | null;
  description: string | null;
  start_time: string | null;
}

export interface LsmRecentStudentEventsResponse {
  student_id: string;
  items: LsmRecentStudentEventItem[];
}

export interface LsmRecentClassEventItem {
  student_id: string;
  status: string | null;
  score: number | null;
}

export interface LsmRecentClassEventsResponse {
  class_id: string;
  items: LsmRecentClassEventItem[];
}

export interface LsmClassWeekItem {
  id: string;
  week_no: number | null;
  title: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface LsmStudentWeeklyTaskItem {
  task_code: string | null;
  task_title: string | null;
  section_type: string | null;
  content_type: string | null;
  task_status: string;
  task_next_action: string | null;
  display_order: number | null;
  total_student_completed: number;
}

export interface LsmStudentWeeklyTasksResponse {
  student_id: string;
  class_code: string;
  week_no: number;
  items: LsmStudentWeeklyTaskItem[];
}

export interface LsmWeekProgressResponse {
  class_week_id: string | null;
  total_unfinished_tasks: number;
  total_tasks: number;
  progress_percent: number;
}

export interface LsmStudentClassWeekResultItem {
  id: string;
  student_id: string;
  class_id: string;
  week_id: string;
  class_code: string | null;
  week_no: number | null;
  teacher_comment: string | null;
  week_score: number | null;
  week_score_ranking: number | null;
  total_week_stickers: number | null;
  total_week_stickers_ranking: number | null;
  homework_score: number | null;
  homework_score_ranking: number | null;
  homework_stickers: number | null;
  extra_assignment_score: number | null;
  extra_assignment_score_ranking: number | null;
  extra_assignment_stickers: number | null;
  preparation_score: number | null;
  preparation_score_ranking: number | null;
  preparation_stickers: number | null;
  in_class_score: number | null;
  in_class_score_ranking: number | null;
  in_class_stickers: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LsmStudentPreviousWeekResultResponse {
  student_id: string;
  class_code: string;
  current_week_no: number | null;
  previous_week_no: number | null;
  result: LsmStudentClassWeekResultItem | null;
}

export interface LsmStudentPreviousWeekResultByWeekNoResponse {
  student_id: string;
  class_code: string;
  requested_week_no: number;
  previous_week_no: number | null;
  result: LsmStudentClassWeekResultItem | null;
}

export interface LsmClassCourseInfo {
  avatar_url: string | null;
  class_name: string | null;
  class_code: string | null;
  slogan: string | null;
}

export interface LsmStudentClassDashboardResponse {
  student_id: string;
  class_code: string;
  class_info: LsmClassCourseInfo | null;
  reference_context: {
    mode: "CURRENT" | "BY_WEEK_NO";
    requested_week_no: number | null;
    resolved_week_no: number | null;
  };
  current_week: LsmClassWeekItem | null;
  current_week_tasks: LsmStudentWeeklyTaskItem[];
  current_week_progress: LsmWeekProgressResponse | null;
  previous_week: LsmClassWeekItem | null;
  previous_week_result: LsmStudentClassWeekResultItem | null;
}

export interface LsmStudentTaskInfo {
  task_code: string;
  task_title: string | null;
  content_type: string | null;
}

export interface LsmStudentTaskVideoLectureInfo {
  id: string;
  title: string | null;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
}

export interface LsmStudentTaskVideoQuizQuestionInfo {
  id: string;
  question_text: string | null;
  question_type: string | null;
  options: any;
  correct_answer: string | null;
  explanation: string | null;
  default_score: number | null;
  difficulty_level: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LsmStudentTaskVideoQuizEventQuestionItem {
  id: string;
  video_quiz_event_id: string;
  quiz_question_id: string | null;
  is_start_question: boolean;
  display_order: number | null;
  score: number | null;
  next_correct_question_id: string | null;
  next_fail_question_id: string | null;
  correct_action: string | null;
  fail_action: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  quiz_question: LsmStudentTaskVideoQuizQuestionInfo | null;
  next_correct_question: LsmStudentTaskVideoQuizQuestionInfo | null;
  next_fail_question: LsmStudentTaskVideoQuizQuestionInfo | null;
}

export interface LsmStudentTaskVideoQuizEventItem {
  id: string;
  lecture_video_id: string;
  title: string | null;
  description: string | null;
  trigger_second: number | null;
  pause_video: boolean;
  is_required: boolean;
  questions: LsmStudentTaskVideoQuizEventQuestionItem[];
}

export interface LsmStudentTaskStatistics {
  section_type: string | null;
  class_id: string | null;
  class_week_id: string | null;
  total_student_assigned: number;
  total_student_completed: number;
  highest_score: number | null;
}

export interface LsmStudentTaskContentBaseResponse {
  student_id: string;
  class_code: string;
  task_code: string;
  content_type: string | null;
  class_info: LsmClassCourseInfo | null;
  task_info: LsmStudentTaskInfo | null;
  task_statistics: LsmStudentTaskStatistics;
}

export interface LsmStudentTaskFileInfo {
  file_url: string | null;
  file_name: string | null;
}

export interface LsmStudentTaskFileContentData {
  content_id: string | null;
  file: LsmStudentTaskFileInfo | null;
}

export interface LsmStudentTaskQuizQuestionItem {
  id: string;
  question_text: string | null;
  question_type: string | null;
  options: any;
  correct_answer: string | null;
  explanation: string | null;
  default_score: number | null;
  difficulty_level: string | null;
  display_order: number | null;
  score: number | null;
  is_required: boolean;
}

export interface LsmStudentTaskQuizTestInfo {
  id: string;
  title: string | null;
  description: string | null;
  quiz_type: string | null;
  time_limit_minutes: number | null;
  max_attempts: number | null;
  passing_score: number | null;
  shuffle_question: boolean;
  shuffle_option: boolean;
}

export interface LsmStudentTaskQuizTestData {
  content_id: string | null;
  title: string | null;
  quiz_test: LsmStudentTaskQuizTestInfo | null;
  questions: LsmStudentTaskQuizQuestionItem[];
}

export interface LsmStudentTaskVideoLectureResponse
  extends LsmStudentTaskContentBaseResponse {
  video_title: string | null;
  video_id: string | null;
  lecture_video: LsmStudentTaskVideoLectureInfo | null;
  quiz_events: LsmStudentTaskVideoQuizEventItem[];
}

export interface LsmStudentTaskFileResponse
  extends LsmStudentTaskContentBaseResponse {
  file_content: LsmStudentTaskFileContentData | null;
}

export interface LsmStudentTaskQuizTestResponse
  extends LsmStudentTaskContentBaseResponse {
  quiz_test: LsmStudentTaskQuizTestData | null;
}

export type LsmStudentTaskContentResponse =
  | LsmStudentTaskVideoLectureResponse
  | LsmStudentTaskFileResponse
  | LsmStudentTaskQuizTestResponse;