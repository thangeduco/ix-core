"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LsmRepository = void 0;
const postgres_1 = require("../../../shared/db/postgres");
class LsmRepository {
    async createVideoLearningSession(payload) {
        const query = `
      insert into video_learning_sessions (
        student_user_id,
        lesson_video_id,
        start_at,
        end_at,
        watched_seconds,
        completion_rate,
        is_completed
      )
      values ($1, $2, coalesce($3::timestamp, now()), null, 0, 0, false)
      returning *
    `;
        const result = await postgres_1.pool.query(query, [
            payload.student_user_id,
            payload.lesson_video_id,
            payload.start_at || null
        ]);
        return result.rows[0];
    }
    async updateVideoLearningSession(sessionId, payload) {
        const query = `
      update video_learning_sessions
      set end_at = coalesce($2::timestamp, now()),
          watched_seconds = $3,
          completion_rate = $4,
          is_completed = $5
      where id = $1
      returning *
    `;
        const result = await postgres_1.pool.query(query, [
            sessionId,
            payload.end_at || null,
            payload.watched_seconds,
            payload.completion_rate,
            payload.is_completed
        ]);
        return result.rows[0] || null;
    }
    async findVideoSessionById(sessionId) {
        const query = `
      select *
      from video_learning_sessions
      where id = $1
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [sessionId]);
        return result.rows[0] || null;
    }
    async findQuizById(quizId) {
        const query = `
      select *
      from quizzes
      where id = $1
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [quizId]);
        return result.rows[0] || null;
    }
    async countQuizAttempts(quizId, studentUserId) {
        const query = `
      select count(*)::int as total
      from quiz_attempts
      where quiz_id = $1 and student_user_id = $2
    `;
        const result = await postgres_1.pool.query(query, [quizId, studentUserId]);
        return result.rows[0]?.total || 0;
    }
    async findQuizQuestionsWithOptions(quizId) {
        const query = `
      select
        qq.id as question_id,
        qq.score as question_score,
        qo.id as option_id,
        qo.is_correct
      from quiz_questions qq
      join quiz_options qo on qo.question_id = qq.id
      where qq.quiz_id = $1
      order by qq.display_order asc, qo.display_order asc
    `;
        const result = await postgres_1.pool.query(query, [quizId]);
        return result.rows;
    }
    async createQuizAttempt(payload) {
        const query = `
      insert into quiz_attempts (
        quiz_id,
        student_user_id,
        attempt_no,
        started_at,
        submitted_at,
        score,
        correct_count,
        status
      )
      values (
        $1,
        $2,
        $3,
        coalesce($4::timestamp, now()),
        coalesce($5::timestamp, now()),
        $6,
        $7,
        'submitted'
      )
      returning *
    `;
        const result = await postgres_1.pool.query(query, [
            payload.quiz_id,
            payload.student_user_id,
            payload.attempt_no,
            payload.started_at || null,
            payload.submitted_at || null,
            payload.score,
            payload.correct_count
        ]);
        return result.rows[0];
    }
    async createQuizAttemptAnswer(payload) {
        const query = `
      insert into quiz_attempt_answers (
        quiz_attempt_id,
        question_id,
        selected_option_id,
        is_correct,
        score_awarded
      )
      values ($1, $2, $3, $4, $5)
      returning *
    `;
        const result = await postgres_1.pool.query(query, [
            payload.quiz_attempt_id,
            payload.question_id,
            payload.selected_option_id,
            payload.is_correct,
            payload.score_awarded
        ]);
        return result.rows[0];
    }
    async findQuizAttemptById(attemptId) {
        const query = `
      select *
      from quiz_attempts
      where id = $1
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [attemptId]);
        return result.rows[0] || null;
    }
    async listQuizAttemptAnswers(attemptId) {
        const query = `
      select *
      from quiz_attempt_answers
      where quiz_attempt_id = $1
      order by id asc
    `;
        const result = await postgres_1.pool.query(query, [attemptId]);
        return result.rows;
    }
    async createHomeworkSubmission(payload) {
        const query = `
      insert into homework_submissions (
        homework_sheet_id,
        student_user_id,
        submitted_at,
        submission_status,
        submission_note,
        zip_file_id
      )
      values ($1, $2, now(), 'submitted', $3, $4)
      returning *
    `;
        const result = await postgres_1.pool.query(query, [
            payload.homework_sheet_id,
            payload.student_user_id,
            payload.submission_note || null,
            payload.zip_file_id || null
        ]);
        return result.rows[0];
    }
    async findHomeworkSubmissionById(submissionId) {
        const query = `
      select *
      from homework_submissions
      where id = $1
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [submissionId]);
        return result.rows[0] || null;
    }
    async listHomeworkSubmissions(homeworkId) {
        const query = `
      select *
      from homework_submissions
      where homework_sheet_id = $1
      order by submitted_at desc nulls last
    `;
        const result = await postgres_1.pool.query(query, [homeworkId]);
        return result.rows;
    }
    async createClassworkResult(payload) {
        const query = `
      insert into classwork_results (
        classwork_sheet_id,
        student_user_id,
        score,
        teacher_comment,
        recorded_at
      )
      values ($1, $2, $3, $4, now())
      returning *
    `;
        const result = await postgres_1.pool.query(query, [
            payload.classwork_sheet_id,
            payload.student_user_id,
            payload.score,
            payload.teacher_comment || null
        ]);
        return result.rows[0];
    }
    async createClassTestResult(payload) {
        const query = `
      insert into class_test_results (
        class_test_id,
        student_user_id,
        score,
        teacher_comment,
        recorded_at
      )
      values ($1, $2, $3, $4, now())
      returning *
    `;
        const result = await postgres_1.pool.query(query, [
            payload.class_test_id,
            payload.student_user_id,
            payload.score,
            payload.teacher_comment || null
        ]);
        return result.rows[0];
    }
    async createPeriodicExamResult(payload) {
        const query = `
      insert into periodic_exam_results (
        periodic_exam_id,
        student_user_id,
        score,
        rank_in_exam,
        recorded_at
      )
      values ($1, $2, $3, $4, now())
      returning *
    `;
        const result = await postgres_1.pool.query(query, [
            payload.periodic_exam_id,
            payload.student_user_id,
            payload.score,
            payload.rank_in_exam || null
        ]);
        return result.rows[0];
    }
    async findStudentWeekProgress(studentUserId, weekId) {
        const query = `
      select *
      from student_week_progress
      where student_user_id = $1 and course_week_id = $2
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [studentUserId, weekId]);
        return result.rows[0] || null;
    }
    async upsertStudentWeekProgress(payload) {
        const existing = await this.findStudentWeekProgress(payload.student_user_id, payload.course_week_id);
        if (!existing) {
            const insertQuery = `
        insert into student_week_progress (
          student_user_id,
          course_week_id,
          lesson_completion_rate,
          quiz_completion_rate,
          homework_completion_rate,
          overall_completion_rate,
          status
        )
        values ($1, $2, $3, $4, $5, $6, $7)
        returning *
      `;
            const result = await postgres_1.pool.query(insertQuery, [
                payload.student_user_id,
                payload.course_week_id,
                payload.lesson_completion_rate,
                payload.quiz_completion_rate,
                payload.homework_completion_rate,
                payload.overall_completion_rate,
                payload.status
            ]);
            return result.rows[0];
        }
        const updateQuery = `
      update student_week_progress
      set lesson_completion_rate = $3,
          quiz_completion_rate = $4,
          homework_completion_rate = $5,
          overall_completion_rate = $6,
          status = $7
      where student_user_id = $1 and course_week_id = $2
      returning *
    `;
        const result = await postgres_1.pool.query(updateQuery, [
            payload.student_user_id,
            payload.course_week_id,
            payload.lesson_completion_rate,
            payload.quiz_completion_rate,
            payload.homework_completion_rate,
            payload.overall_completion_rate,
            payload.status
        ]);
        return result.rows[0];
    }
    async listVideoSessionsByStudent(studentUserId) {
        const query = `
      select *
      from video_learning_sessions
      where student_user_id = $1
      order by start_at desc
    `;
        const result = await postgres_1.pool.query(query, [studentUserId]);
        return result.rows;
    }
    async listQuizAttemptsByStudent(studentUserId) {
        const query = `
      select *
      from quiz_attempts
      where student_user_id = $1
      order by submitted_at desc nulls last
    `;
        const result = await postgres_1.pool.query(query, [studentUserId]);
        return result.rows;
    }
    async listHomeworkSubmissionsByStudent(studentUserId) {
        const query = `
      select *
      from homework_submissions
      where student_user_id = $1
      order by submitted_at desc nulls last
    `;
        const result = await postgres_1.pool.query(query, [studentUserId]);
        return result.rows;
    }
}
exports.LsmRepository = LsmRepository;
