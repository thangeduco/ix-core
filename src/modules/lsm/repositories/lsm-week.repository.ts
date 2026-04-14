import { pool } from "../../../shared/db/postgres";

export class LsmWeekRepository {
  async findCurrentClassWeekNo(classCode: string): Promise<number | null> {
    const result = await pool.query(
      `
      WITH base AS (
        SELECT
          cw.week_no,
          cw.start_date,
          cw.end_date,
          CURRENT_DATE AS db_current_date,
          MIN(cw.start_date) OVER () AS min_start_date,
          MAX(cw.end_date) OVER () AS max_end_date
        FROM class_week cw
        WHERE cw.class_code = $1
          AND cw.status = 'ACTIVE'
      )
      SELECT week_no
      FROM base
      ORDER BY
        CASE
          WHEN db_current_date < min_start_date THEN 0
          WHEN db_current_date > max_end_date THEN 1
          ELSE 2
        END ASC,
        CASE
          WHEN db_current_date < min_start_date THEN start_date
          ELSE NULL
        END ASC,
        CASE
          WHEN db_current_date > max_end_date THEN end_date
          ELSE NULL
        END DESC,
        CASE
          WHEN db_current_date >= min_start_date
           AND db_current_date <= max_end_date
          THEN ABS(start_date - db_current_date)
          ELSE NULL
        END ASC,
        week_no ASC
      LIMIT 1
      `,
      [classCode]
    );

    if (!result.rows[0]) {
      return null;
    }

    return result.rows[0].week_no !== null && result.rows[0].week_no !== undefined
      ? Number(result.rows[0].week_no)
      : null;
  }

  async findClassWeekByWeekNo(classCode: string, weekNo: number) {
    const result = await pool.query(
      `
      SELECT
        cw.id,
        cw.week_no,
        cw.title,
        cw.start_date,
        cw.end_date
      FROM class_week cw
      WHERE cw.class_code = $1
        AND cw.week_no = $2
      LIMIT 1
      `,
      [classCode, weekNo]
    );

    return result.rows[0] ?? null;
  }

  async findStudentWeeklyTasks(
    studentId: string,
    classCode: string,
    weekNo: number
  ) {
    const result = await pool.query(
      `
      SELECT
        st.task_code,
        st.task_title,
        st.section_type,
        st.content_type,
        st.assign_status,
        st.task_next_action,
        st.display_order
      FROM student_task st
      WHERE st.student_id = $1
        AND st.class_code = $2
        AND st.week_no = $3
        AND st.section_type IN (
          'HOMEWORK_EXTRA_FOR_STUDENT',
          'HOMEWORK_FOR_CLASS',
          'PREPARE_LESSON_FOR_CLASS',
          'OFFLINE_IN_CLASSROOM'
        )
        AND COALESCE(st.is_active, true) = true
      ORDER BY
        CASE st.section_type
          WHEN 'HOMEWORK_EXTRA_FOR_STUDENT' THEN 1
          WHEN 'HOMEWORK_FOR_CLASS' THEN 2
          WHEN 'PREPARE_LESSON_FOR_CLASS' THEN 3
          WHEN 'OFFLINE_IN_CLASSROOM' THEN 4
          ELSE 99
        END ASC,
        st.display_order ASC NULLS LAST,
        st.task_code ASC NULLS LAST
      `,
      [studentId, classCode, weekNo]
    );

    return result.rows;
  }

  async findWeekProgressSummary(
    studentId: string,
    classCode: string,
    weekNo: number
  ) {
    const result = await pool.query(
      `
      SELECT
        MIN(st.class_week_id)::text AS class_week_id,
        COUNT(DISTINCT st.source_id) AS total_tasks,
        COUNT(
          DISTINCT CASE
            WHEN st.assign_status IN ('assigned', 'in_progress', 'redo_required')
            THEN st.source_id
            ELSE NULL
          END
        ) AS total_unfinished_tasks
      FROM student_task st
      WHERE st.student_id = $1
        AND st.class_code = $2
        AND st.week_no = $3
        AND st.section_type IN (
          'HOMEWORK_EXTRA_FOR_STUDENT',
          'HOMEWORK_FOR_CLASS',
          'PREPARE_LESSON_FOR_CLASS',
          'OFFLINE_IN_CLASSROOM'
        )
        AND COALESCE(st.is_active, true) = true
      `,
      [studentId, classCode, weekNo]
    );

    return result.rows[0] ?? null;
  }

  async findStudentClassWeekResultByWeekNo(
    studentId: string,
    classCode: string,
    weekNo: number
  ) {
    const result = await pool.query(
      `
      SELECT
        scwr.id,
        scwr.student_id,
        scwr.class_id,
        scwr.week_id,
        scwr.class_code,
        scwr.week_no,
        scwr.teacher_comment,
        scwr.week_score,
        scwr.total_week_stickers,
        scwr.homework_score,
        scwr.homework_stickers,
        scwr.extra_assignment_score,
        scwr.extra_assignment_stickers,
        scwr.preparation_score,
        scwr.preparation_stickers,
        scwr.in_class_score,
        scwr.in_class_stickers,
        scwr.created_at,
        scwr.updated_at
      FROM student_class_week_result scwr
      WHERE scwr.student_id = $1
        AND scwr.class_code = $2
        AND scwr.week_no = $3
      ORDER BY scwr.updated_at DESC NULLS LAST, scwr.created_at DESC NULLS LAST
      LIMIT 1
      `,
      [studentId, classCode, weekNo]
    );

    return result.rows[0] ?? null;
  }

  async findStudentWeekRankings(
    studentId: string,
    classCode: string,
    weekNo: number
  ) {
    const result = await pool.query(
      `
      WITH ranked AS (
        SELECT
          scwr.student_id,
          RANK() OVER (
            ORDER BY COALESCE(scwr.week_score, 0) DESC, scwr.student_id ASC
          ) AS week_score_ranking,
          RANK() OVER (
            ORDER BY COALESCE(scwr.total_week_stickers, 0) DESC, scwr.student_id ASC
          ) AS total_week_stickers_ranking,
          RANK() OVER (
            ORDER BY COALESCE(scwr.homework_score, 0) DESC, scwr.student_id ASC
          ) AS homework_score_ranking,
          RANK() OVER (
            ORDER BY COALESCE(scwr.extra_assignment_score, 0) DESC, scwr.student_id ASC
          ) AS extra_assignment_score_ranking,
          RANK() OVER (
            ORDER BY COALESCE(scwr.preparation_score, 0) DESC, scwr.student_id ASC
          ) AS preparation_score_ranking,
          RANK() OVER (
            ORDER BY COALESCE(scwr.in_class_score, 0) DESC, scwr.student_id ASC
          ) AS in_class_score_ranking
        FROM student_class_week_result scwr
        WHERE scwr.class_code = $2
          AND scwr.week_no = $3
      )
      SELECT
        ranked.student_id,
        ranked.week_score_ranking,
        ranked.total_week_stickers_ranking,
        ranked.homework_score_ranking,
        ranked.extra_assignment_score_ranking,
        ranked.preparation_score_ranking,
        ranked.in_class_score_ranking
      FROM ranked
      WHERE ranked.student_id = $1
      LIMIT 1
      `,
      [studentId, classCode, weekNo]
    );

    return result.rows[0] ?? null;
  }

  async findTaskStatisticsByTaskCode(
    studentId: string,
    classCode: string,
    taskCode: string
  ) {
    const result = await pool.query(
      `
      WITH task_context AS (
        SELECT
          st.section_type,
          st.class_id,
          st.class_week_id
        FROM student_task st
        WHERE st.student_id = $1
          AND st.class_code = $2
          AND st.task_code = $3
          AND COALESCE(st.is_active, true) = true
        ORDER BY st.updated_at DESC NULLS LAST, st.created_at DESC NULLS LAST
        LIMIT 1
      ),
      task_stats AS (
        SELECT
          tc.section_type,
          tc.class_id,
          tc.class_week_id,
          COUNT(DISTINCT st_all.student_id) AS total_student_assigned,
          COUNT(
            DISTINCT CASE
              WHEN st_all.assign_status IN (
                'submitted_for_review',
                'done',
                'reviewed_ok'
              )
              THEN st_all.student_id
              ELSE NULL
            END
          ) AS total_student_completed
        FROM task_context tc
        LEFT JOIN student_task st_all
          ON st_all.class_id = tc.class_id
         AND st_all.class_week_id = tc.class_week_id
         AND st_all.section_type = tc.section_type
         AND COALESCE(st_all.is_active, true) = true
        GROUP BY
          tc.section_type,
          tc.class_id,
          tc.class_week_id
      ),
      score_stats AS (
        SELECT
          tc.section_type,
          MAX(
            CASE
              WHEN tc.section_type = 'PREPARE_LESSON_FOR_CLASS'
                THEN scwr.preparation_score
              WHEN tc.section_type = 'HOMEWORK_EXTRA_FOR_STUDENT'
                THEN scwr.extra_assignment_score
              WHEN tc.section_type = 'HOMEWORK_FOR_CLASS'
                THEN scwr.homework_score
              WHEN tc.section_type = 'OFFLINE_IN_CLASSROOM'
                THEN scwr.in_class_score
              ELSE NULL
            END
          ) AS highest_score
        FROM task_context tc
        LEFT JOIN student_class_week_result scwr
          ON scwr.class_id = tc.class_id
         AND scwr.week_id = tc.class_week_id
        GROUP BY tc.section_type
      )
      SELECT
        ts.section_type,
        ts.class_id,
        ts.class_week_id,
        ts.total_student_assigned,
        ts.total_student_completed,
        ss.highest_score
      FROM task_stats ts
      LEFT JOIN score_stats ss
        ON ss.section_type = ts.section_type
      LIMIT 1
      `,
      [studentId, classCode, taskCode]
    );

    return result.rows[0] ?? null;
  }
}