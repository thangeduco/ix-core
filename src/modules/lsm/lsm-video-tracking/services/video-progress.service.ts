import { pool } from "../../../../shared/db/postgres";

export class VideoProgressService {

  async updateProgress({
    student_id,
    task_id,
    task_code,
    lecture_video_id,
    current_second
  }: any) {

    await pool.query(`
      INSERT INTO student_video_progress (
        student_id,
        task_id,
        task_code,
        lecture_video_id,
        last_position_second,
        total_sessions,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,1,NOW())
      ON CONFLICT (student_id, task_id, lecture_video_id)
      DO UPDATE SET
        last_position_second = $5,
        total_sessions = student_video_progress.total_sessions + 1,
        updated_at = NOW()
    `, [
      student_id,
      task_id,
      task_code,
      lecture_video_id,
      current_second
    ]);
  }
}