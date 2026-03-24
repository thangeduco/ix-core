import { pool } from "../../../shared/db/postgres";

export class TewRepository {
  async findWeeklyReviewById(reviewId: string) {
    const query = `
      select *
      from weekly_reviews
      where id = $1
      limit 1
    `;
    const result = await pool.query(query, [reviewId]);
    return result.rows[0] || null;
  }

  async findWeeklyReviewByStudentAndWeek(studentUserId: string, courseWeekId: string) {
    const query = `
      select *
      from weekly_reviews
      where student_user_id = $1
        and course_week_id = $2
      limit 1
    `;
    const result = await pool.query(query, [studentUserId, courseWeekId]);
    return result.rows[0] || null;
  }

  async createWeeklyReview(payload: {
    student_user_id: string;
    course_week_id: string;
    teacher_user_id: string;
    overall_comment?: string;
    knowledge_comment?: string;
    skill_comment?: string;
    attitude_comment?: string;
  }) {
    const query = `
      insert into weekly_reviews (
        student_user_id,
        course_week_id,
        teacher_user_id,
        overall_comment,
        knowledge_comment,
        skill_comment,
        attitude_comment,
        created_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, now())
      returning *
    `;
    const values = [
      payload.student_user_id,
      payload.course_week_id,
      payload.teacher_user_id,
      payload.overall_comment || null,
      payload.knowledge_comment || null,
      payload.skill_comment || null,
      payload.attitude_comment || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async updateWeeklyReview(reviewId: string, payload: {
    overall_comment?: string;
    knowledge_comment?: string;
    skill_comment?: string;
    attitude_comment?: string;
  }) {
    const entries = Object.entries(payload).filter(([, value]) => value !== undefined);

    if (!entries.length) {
      return this.findWeeklyReviewById(reviewId);
    }

    const setClauses = entries.map(([key], index) => `${key} = $${index + 2}`);
    const values = [reviewId, ...entries.map(([, value]) => value)];

    const query = `
      update weekly_reviews
      set ${setClauses.join(", ")}
      where id = $1
      returning *
    `;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async deleteWeeklyReviewScores(reviewId: string) {
    const query = `
      delete from weekly_review_scores
      where weekly_review_id = $1
    `;
    await pool.query(query, [reviewId]);
  }

  async createWeeklyReviewScore(payload: {
    weekly_review_id: string;
    score_type: string;
    score_value: number;
    max_score?: number;
  }) {
    const query = `
      insert into weekly_review_scores (
        weekly_review_id,
        score_type,
        score_value,
        max_score
      )
      values ($1, $2, $3, $4)
      returning *
    `;
    const result = await pool.query(query, [
      payload.weekly_review_id,
      payload.score_type,
      payload.score_value,
      payload.max_score || null
    ]);
    return result.rows[0];
  }

  async listWeeklyReviewScores(reviewId: string) {
    const query = `
      select *
      from weekly_review_scores
      where weekly_review_id = $1
      order by id asc
    `;
    const result = await pool.query(query, [reviewId]);
    return result.rows;
  }

  async deleteWeeklyReviewComments(reviewId: string) {
    const query = `
      delete from weekly_review_comments
      where weekly_review_id = $1
    `;
    await pool.query(query, [reviewId]);
  }

  async createWeeklyReviewComment(payload: {
    weekly_review_id: string;
    comment_type: string;
    comment_text: string;
  }) {
    const query = `
      insert into weekly_review_comments (
        weekly_review_id,
        comment_type,
        comment_text
      )
      values ($1, $2, $3)
      returning *
    `;
    const result = await pool.query(query, [
      payload.weekly_review_id,
      payload.comment_type,
      payload.comment_text
    ]);
    return result.rows[0];
  }

  async listWeeklyReviewComments(reviewId: string) {
    const query = `
      select *
      from weekly_review_comments
      where weekly_review_id = $1
      order by id asc
    `;
    const result = await pool.query(query, [reviewId]);
    return result.rows;
  }

  async createTeacherAssignedTask(payload: {
    weekly_review_id?: string;
    student_user_id: string;
    parent_user_id: string;
    title: string;
    description?: string;
    due_at?: string;
    status?: string;
  }) {
    const query = `
      insert into teacher_assigned_tasks (
        weekly_review_id,
        student_user_id,
        parent_user_id,
        title,
        description,
        due_at,
        status,
        created_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, now())
      returning *
    `;
    const result = await pool.query(query, [
      payload.weekly_review_id || null,
      payload.student_user_id,
      payload.parent_user_id,
      payload.title,
      payload.description || null,
      payload.due_at || null,
      payload.status || "pending"
    ]);
    return result.rows[0];
  }

  async listTeacherAssignedTasks(filters: {
    student_user_id?: string;
    parent_user_id?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.student_user_id) {
      values.push(filters.student_user_id);
      conditions.push(`student_user_id = $${values.length}`);
    }

    if (filters.parent_user_id) {
      values.push(filters.parent_user_id);
      conditions.push(`parent_user_id = $${values.length}`);
    }

    if (filters.status) {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length ? `where ${conditions.join(" and ")}` : "";
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    values.push(limit);
    values.push(offset);

    const query = `
      select *
      from teacher_assigned_tasks
      ${whereClause}
      order by created_at desc
      limit $${values.length - 1}
      offset $${values.length}
    `;
    const result = await pool.query(query, values);
    return result.rows;
  }

  async createStudentHomeworkOverride(payload: {
    student_user_id: string;
    homework_sheet_id: string;
    extra_instruction?: string;
    attachment_file_id?: string;
    created_by: string;
  }) {
    const query = `
      insert into student_homework_overrides (
        student_user_id,
        homework_sheet_id,
        extra_instruction,
        attachment_file_id,
        created_by,
        created_at
      )
      values ($1, $2, $3, $4, $5, now())
      returning *
    `;
    const result = await pool.query(query, [
      payload.student_user_id,
      payload.homework_sheet_id,
      payload.extra_instruction || null,
      payload.attachment_file_id || null,
      payload.created_by
    ]);
    return result.rows[0];
  }

  async createOfflineActivityRecord(payload: {
    class_id: string;
    course_week_id: string;
    student_user_id: string;
    activity_type: string;
    score?: number;
    comment?: string;
    recorded_by: string;
  }) {
    const query = `
      insert into offline_activity_records (
        class_id,
        course_week_id,
        student_user_id,
        activity_type,
        score,
        comment,
        recorded_by,
        recorded_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, now())
      returning *
    `;
    const result = await pool.query(query, [
      payload.class_id,
      payload.course_week_id,
      payload.student_user_id,
      payload.activity_type,
      payload.score || null,
      payload.comment || null,
      payload.recorded_by
    ]);
    return result.rows[0];
  }

  async findStudentWeekProgress(studentUserId: string, courseWeekId: string) {
    const query = `
      select *
      from student_week_progress
      where student_user_id = $1
        and course_week_id = $2
      limit 1
    `;
    const result = await pool.query(query, [studentUserId, courseWeekId]);
    return result.rows[0] || null;
  }

  async listQuizAttemptsByStudentAndWeek(studentUserId: string, courseWeekId: string) {
    const query = `
      select qa.*
      from quiz_attempts qa
      join quizzes q on q.id = qa.quiz_id
      where qa.student_user_id = $1
        and q.course_week_id = $2
      order by qa.submitted_at desc nulls last
    `;
    const result = await pool.query(query, [studentUserId, courseWeekId]);
    return result.rows;
  }

  async listHomeworkSubmissionsByStudentAndWeek(studentUserId: string, courseWeekId: string) {
    const query = `
      select hs.*
      from homework_submissions hs
      join homework_sheets hw on hw.id = hs.homework_sheet_id
      where hs.student_user_id = $1
        and hw.course_week_id = $2
      order by hs.submitted_at desc nulls last
    `;
    const result = await pool.query(query, [studentUserId, courseWeekId]);
    return result.rows;
  }

  async listClassTestResultsByStudentAndWeek(studentUserId: string, courseWeekId: string) {
    const query = `
      select ctr.*
      from class_test_results ctr
      join class_tests ct on ct.id = ctr.class_test_id
      where ctr.student_user_id = $1
        and ct.course_week_id = $2
      order by ctr.recorded_at desc
    `;
    const result = await pool.query(query, [studentUserId, courseWeekId]);
    return result.rows;
  }

  async listPeriodicExamResultsByStudentAndCourse(studentUserId: string, courseId: string) {
    const query = `
      select per.*
      from periodic_exam_results per
      join periodic_exams pe on pe.id = per.periodic_exam_id
      where per.student_user_id = $1
        and pe.course_id = $2
      order by per.recorded_at desc
    `;
    const result = await pool.query(query, [studentUserId, courseId]);
    return result.rows;
  }
}
