import { pool } from "../../../shared/db/postgres";

export class LsmEventRepository {
  async findRecentStudentEvents(studentId: string, limit: number) {
    const result = await pool.query(
      `
      SELECT
        ce.event_name AS event_name,
        ce.description,
        ce.start_time
      FROM class_event ce
      WHERE ce.student_id = $1
      ORDER BY ce.start_time DESC NULLS LAST
      LIMIT $2
      `,
      [studentId, limit]
    );

    return result.rows;
  }

  async findRecentClassEvents(classId: string, limit: number) {
    const result = await pool.query(
      `
      SELECT
        se.student_id,
        se.status,
        se.score
      FROM student_event se
      WHERE se.class_id = $1
      ORDER BY se.created_at DESC NULLS LAST
      LIMIT $2
      `,
      [classId, limit]
    );

    return result.rows;
  }
}