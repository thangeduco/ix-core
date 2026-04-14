import { pool } from "../../../shared/db/postgres";

export class LsmCourseRepository {
  async findStudentCourseInfos(studentId: string) {
    const result = await pool.query(
      `
      SELECT DISTINCT
        sce.class_id,
        cc.avatar_url,
        cc.class_name,
        cc.class_code,
        cc.slogan
      FROM student_class_enrollment sce
      JOIN class_course cc
        ON cc.class_id = sce.class_id
      WHERE sce.student_id = $1
      ORDER BY cc.class_name ASC NULLS LAST, cc.class_code ASC NULLS LAST, sce.class_id ASC
      `,
      [studentId]
    );

    return result.rows;
  }

  async findStudentPendingWeeks(studentId: string) {
    const result = await pool.query(
      `
      SELECT
        st.class_id,
        cw.id AS class_week_id,
        cw.week_no,
        cw.title,

        COUNT(
          DISTINCT CASE
            WHEN st_done.assign_status = 'done' THEN st_done.student_id
            ELSE NULL
          END
        ) AS total_student_done,

        COUNT(DISTINCT st_all.student_id) AS total_student_assigned

      FROM student_task st
      JOIN class_week cw
        ON cw.id = st.class_week_id

      LEFT JOIN student_task st_all
        ON st_all.class_week_id = cw.id
       AND st_all.task_type = 'full_week'

      LEFT JOIN student_task st_done
        ON st_done.class_week_id = cw.id
       AND st_done.task_type = 'full_week'
       AND st_done.assign_status = 'done'

      WHERE st.student_id = $1
        AND st.task_type = 'full_week'
        AND st.assign_status != 'done'

      GROUP BY
        st.class_id,
        cw.id,
        cw.week_no,
        cw.title

      ORDER BY
        st.class_id ASC,
        cw.week_no ASC NULLS LAST,
        cw.id ASC
      `,
      [studentId]
    );

    return result.rows;
  }

  async findClassCourseInfoByClassCode(classCode: string) {
    const result = await pool.query(
      `
      SELECT
        cc.avatar_url,
        cc.class_name,
        cc.class_code,
        cc.slogan
      FROM class_course cc
      WHERE cc.class_code = $1
      LIMIT 1
      `,
      [classCode]
    );

    return result.rows[0] ?? null;
  }
}