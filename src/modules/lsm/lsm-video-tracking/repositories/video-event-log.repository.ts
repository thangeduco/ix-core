import { pool } from "../../../../shared/db/postgres";

export class VideoEventLogRepository {

  async log(data: any) {
    await pool.query(
      `
      INSERT INTO student_video_interaction_event_log (
        student_id,
        task_id,
        task_code,
        student_video_session_id,
        lecture_video_id,
        event_type,
        event_second,
        from_second,
        to_second,
        playback_rate,
        ref_event_type,
        ref_event_id,
        payload_json,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW())
      `,
      [
        data.student_id,
        data.task_id,
        data.task_code,
        data.session_id,
        data.lecture_video_id,
        data.event_type,
        data.event_second,
        data.from_second,
        data.to_second,
        data.playback_rate,
        data.ref_event_type,
        data.ref_event_id,
        data.payload_json || null
      ]
    );
  }
}