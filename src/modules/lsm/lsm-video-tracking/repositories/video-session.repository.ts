import { pool } from "../../../../shared/db/postgres";

export class VideoSessionRepository {

  async createSession(data: any) {
    const result = await pool.query(
      `
      INSERT INTO student_video_session (
        student_id,
        task_id,
        task_code,
        lecture_video_id,
        started_at,
        start_second,
        device_type,
        app_platform,
        status
      )
      VALUES ($1,$2,$3,$4,NOW(),$5,$6,$7,'PLAYING')
      RETURNING *
      `,
      [
        data.student_id,
        data.task_id,
        data.task_code,
        data.lecture_video_id,
        data.start_second,
        data.device_type,
        data.app_platform
      ]
    );

    return result.rows[0];
  }

  async updateSession(id: number, payload: any) {
    const keys = Object.keys(payload);
    const values = Object.values(payload);

    const setClause = keys.map((k, i) => `${k}=$${i + 2}`).join(",");

    await pool.query(
      `UPDATE student_video_session SET ${setClause}, updated_at=NOW() WHERE id=$1`,
      [id, ...values]
    );
  }
}