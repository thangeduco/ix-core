import { pool } from "../../../shared/db/postgres";

export class LsmVideoRepository {
  async findStudentTaskByTaskCode(
    studentId: string,
    classCode: string,
    taskCode: string
  ) {
    const result = await pool.query(
      `
      SELECT
        st.id,
        st.student_id,
        st.class_id,
        st.class_week_id,
        st.source_type,
        st.source_id,
        st.task_title,
        st.task_description,
        st.task_type,
        st.content_type,
        st.assign_status,
        st.start_at,
        st.deadline_at,
        st.assigned_by_teacher_id,
        st.assigned_at,
        st.submitted_at,
        st.reviewed_at,
        st.review_comment,
        st.attempt_count,
        st.last_redo_requested_at,
        st.is_active,
        st.created_at,
        st.updated_at,
        st.class_code,
        st.week_no,
        st.display_order,
        st.section_type,
        st.task_code,
        st.task_next_action
      FROM student_task st
      WHERE st.student_id = $1
        AND st.class_code = $2
        AND st.task_code = $3
        AND COALESCE(st.is_active, true) = true
      ORDER BY st.updated_at DESC NULLS LAST, st.created_at DESC NULLS LAST
      LIMIT 1
      `,
      [studentId, classCode, taskCode]
    );

    return result.rows[0] ?? null;
  }

  async findClassWeekContentItemById(sourceId: string) {
    const result = await pool.query(
      `
      SELECT
        cwci.id,
        cwci.content_type,
        cwci.content_id,
        cwci.title,
        cwci.description,
        cwci.display_order,
        cwci.is_required,
        cwci.status,
        cwci.created_at,
        cwci.updated_at,
        cwci.section_type,
        cwci.class_week_id
      FROM class_week_content_item cwci
      WHERE cwci.id = $1
      LIMIT 1
      `,
      [sourceId]
    );

    return result.rows[0] ?? null;
  }

  async findStudentClassWeekContentItemById(studentId: string, sourceId: string) {
    const result = await pool.query(
      `
      SELECT
        scwci.id,
        scwci.student_id,
        scwci.class_week_id,
        scwci.content_type,
        scwci.content_id,
        scwci.title,
        scwci.description,
        scwci.display_order,
        scwci.is_required,
        scwci.status,
        scwci.assigned_at,
        scwci.created_at,
        scwci.updated_at,
        scwci.section_type
      FROM student_class_week_content_item scwci
      WHERE scwci.id = $2
        AND scwci.student_id = $1
      LIMIT 1
      `,
      [studentId, sourceId]
    );

    return result.rows[0] ?? null;
  }

  async findLectureVideoById(contentId: string) {
    const result = await pool.query(
      `
      SELECT
        lv.id,
        lv.title,
        lv.description,
        lv.video_url,
        lv.thumbnail_url,
        lv.duration_seconds,
        lv.status,
        lv.created_at,
        lv.updated_at
      FROM lecture_video lv
      WHERE lv.id = $1
      LIMIT 1
      `,
      [contentId]
    );

    return result.rows[0] ?? null;
  }

  async findVideoQuizEventsByLectureVideoId(contentId: string) {
    const result = await pool.query(
      `
      SELECT
        vqe.id,
        vqe.lecture_video_id,
        vqe.title,
        vqe.description,
        vqe.trigger_second,
        vqe.pause_video,
        vqe.is_required,
        vqe.status,
        vqe.created_at,
        vqe.updated_at
      FROM video_quiz_event vqe
      WHERE vqe.lecture_video_id = $1
      ORDER BY vqe.trigger_second ASC NULLS LAST, vqe.id ASC
      `,
      [contentId]
    );

    return result.rows;
  }

  async findVideoQuizEventQuestionsByEventIds(eventIds: string[]) {
    if (!eventIds.length) {
      return [];
    }

    const result = await pool.query(
      `
      SELECT
        vqeq.id,
        vqeq.video_quiz_event_id,
        vqeq.quiz_question_id,
        vqeq.is_start_question,
        vqeq.display_order,
        vqeq.score,
        vqeq.next_correct_question_id,
        vqeq.next_fail_question_id,
        vqeq.correct_action,
        vqeq.fail_action,
        vqeq.status,
        vqeq.created_at,
        vqeq.updated_at
      FROM video_quiz_event_question vqeq
      WHERE vqeq.video_quiz_event_id = ANY($1::bigint[])
      ORDER BY
        vqeq.video_quiz_event_id ASC,
        vqeq.display_order ASC NULLS LAST,
        vqeq.id ASC
      `,
      [eventIds]
    );

    return result.rows;
  }

  async findQuizQuestionsByIds(questionIds: string[]) {
    if (!questionIds.length) {
      return [];
    }

    const result = await pool.query(
      `
      SELECT
        qq.id,
        qq.question_text,
        qq.question_type,
        qq.options,
        qq.correct_answer,
        qq.explanation,
        qq.default_score,
        qq.difficulty_level,
        qq.status,
        qq.created_at,
        qq.updated_at
      FROM quiz_question qq
      WHERE qq.id = ANY($1::bigint[])
      ORDER BY qq.id ASC
      `,
      [questionIds]
    );

    return result.rows;
  }

  async findContentFileById(contentId: string) {
    const result = await pool.query(
      `
      SELECT
        cf.id,
        cf.title,
        cf.description,
        cf.file_type,
        cf.file_url,
        cf.file_name,
        cf.status,
        cf.created_at,
        cf.updated_at
      FROM content_file cf
      WHERE cf.id = $1
      LIMIT 1
      `,
      [contentId]
    );

    return result.rows[0] ?? null;
  }

  async findQuizTestById(quizTestId: string) {
    const result = await pool.query(
      `
      SELECT
        qt.id,
        qt.title,
        qt.description,
        qt.quiz_type,
        qt.time_limit_minutes,
        qt.max_attempts,
        qt.passing_score,
        qt.shuffle_question,
        qt.shuffle_option,
        qt.status,
        qt.created_at,
        qt.updated_at
      FROM quiz_test qt
      WHERE qt.id = $1
      LIMIT 1
      `,
      [quizTestId]
    );

    return result.rows[0] ?? null;
  }

  async findQuizTestQuestionsByQuizTestId(quizTestId: string) {
    const result = await pool.query(
      `
      SELECT
        qtq.id,
        qtq.quiz_test_id,
        qtq.quiz_question_id,
        qtq.display_order,
        qtq.score,
        qtq.is_required,
        qtq.created_at,
        qtq.updated_at
      FROM quiz_test_question qtq
      WHERE qtq.quiz_test_id = $1
      ORDER BY qtq.display_order ASC NULLS LAST, qtq.id ASC
      `,
      [quizTestId]
    );

    return result.rows;
  }
}