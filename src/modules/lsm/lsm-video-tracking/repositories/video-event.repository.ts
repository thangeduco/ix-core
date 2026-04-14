import { pool } from "../../../../shared/db/postgres";

export class VideoEventRepository {

  async createAttempt(data: any) {
    const result = await pool.query(
      `
      INSERT INTO student_video_event_attempt (
        student_id,
        task_id,
        task_code,
        student_video_session_id,
        lecture_video_id,
        video_quiz_event_id,
        attempt_no,
        started_at,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,1,NOW(),'STARTED')
      RETURNING *
      `,
      [
        data.student_id,
        data.task_id,
        data.task_code,
        data.session_id,
        data.lecture_video_id,
        data.video_quiz_event_id
      ]
    );

    return result.rows[0];
  }

  async closeAttempt(attemptId: number) {
    await pool.query(
      `
      UPDATE student_video_event_attempt
      SET status='CLOSED', updated_at=NOW()
      WHERE id=$1
      `,
      [attemptId]
    );
  }

  async submitAttempt(data: any) {
    await pool.query(
      `
      UPDATE student_video_event_attempt
      SET 
        total_questions=$2,
        correct_answers=$3,
        score=$4,
        is_passed=$5,
        submitted_at=NOW(),
        status='DONE'
      WHERE id=$1
      `,
      [
        data.attempt_id,
        data.total_questions,
        data.correct_answers,
        data.score,
        data.is_passed
      ]
    );
  }

  async insertAnswer(data: any) {
    await pool.query(
      `
      INSERT INTO student_video_interaction_answer (
        student_id,
        task_id,
        task_code,
        student_video_session_id,
        student_video_event_attempt_id,
        lecture_video_id,
        video_quiz_event_id,
        question_id,
        selected_answer,
        is_correct,
        answered_video_second,
        answered_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())
      `,
      [
        data.student_id,
        data.task_id,
        data.task_code,
        data.session_id,
        data.attempt_id,
        data.lecture_video_id,
        data.video_quiz_event_id,
        data.question_id,
        data.selected_answer,
        data.is_correct,
        data.answered_second
      ]
    );
  }
}