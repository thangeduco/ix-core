"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CccRepository = void 0;
const postgres_1 = require("../../../shared/db/postgres");
class CccRepository {
    async listCourses(filters) {
        const conditions = [];
        const values = [];
        if (filters.subject) {
            values.push(filters.subject);
            conditions.push(`subject = $${values.length}`);
        }
        if (filters.grade_level) {
            values.push(filters.grade_level);
            conditions.push(`grade_level = $${values.length}`);
        }
        if (filters.course_type) {
            values.push(filters.course_type);
            conditions.push(`course_type = $${values.length}`);
        }
        if (filters.status) {
            values.push(filters.status);
            conditions.push(`status = $${values.length}`);
        }
        if (filters.keyword) {
            values.push(`%${filters.keyword}%`);
            conditions.push(`(name ilike $${values.length} or code ilike $${values.length})`);
        }
        const whereClause = conditions.length > 0 ? `where ${conditions.join(" and ")}` : "";
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const offset = (page - 1) * limit;
        values.push(limit);
        values.push(offset);
        const query = `
      select *
      from courses
      ${whereClause}
      order by created_at desc
      limit $${values.length - 1}
      offset $${values.length}
    `;
        const result = await postgres_1.pool.query(query, values);
        return result.rows;
    }
    async findCourseById(courseId) {
        const query = `
      select *
      from courses
      where id = $1
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [courseId]);
        return result.rows[0] || null;
    }
    async createCourse(payload) {
        const query = `
      insert into courses (
        code,
        name,
        subject,
        grade_level,
        course_type,
        description,
        status,
        thumbnail_file_id,
        created_by,
        created_at,
        updated_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, now(), now())
      returning *
    `;
        const values = [
            payload.code,
            payload.name,
            payload.subject,
            payload.grade_level,
            payload.course_type,
            payload.description || null,
            payload.status || "draft",
            payload.thumbnail_file_id || null,
            payload.created_by || null
        ];
        const result = await postgres_1.pool.query(query, values);
        return result.rows[0];
    }
    async updateCourse(courseId, payload) {
        const entries = Object.entries(payload).filter(([, value]) => value !== undefined);
        if (entries.length === 0) {
            return this.findCourseById(courseId);
        }
        const setClauses = entries.map(([key], index) => `${key} = $${index + 2}`);
        const values = [courseId, ...entries.map(([, value]) => value)];
        const query = `
      update courses
      set ${setClauses.join(", ")},
          updated_at = now()
      where id = $1
      returning *
    `;
        const result = await postgres_1.pool.query(query, values);
        return result.rows[0] || null;
    }
    async listCourseWeeks(courseId) {
        const query = `
      select *
      from course_weeks
      where course_id = $1
      order by week_no asc
    `;
        const result = await postgres_1.pool.query(query, [courseId]);
        return result.rows;
    }
    async createCourseWeek(courseId, payload) {
        const query = `
      insert into course_weeks (
        course_id,
        week_no,
        title,
        description,
        start_date,
        end_date,
        status,
        created_at,
        updated_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, now(), now())
      returning *
    `;
        const values = [
            courseId,
            payload.week_no,
            payload.title,
            payload.description || null,
            payload.start_date || null,
            payload.end_date || null,
            payload.status || "draft"
        ];
        const result = await postgres_1.pool.query(query, values);
        return result.rows[0];
    }
    async findCourseWeekById(weekId) {
        const query = `
      select *
      from course_weeks
      where id = $1
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [weekId]);
        return result.rows[0] || null;
    }
    async listLessonsByWeek(weekId) {
        const query = `
      select *
      from lessons
      where course_week_id = $1
      order by display_order asc, created_at asc
    `;
        const result = await postgres_1.pool.query(query, [weekId]);
        return result.rows;
    }
    async createLesson(weekId, payload) {
        const query = `
      insert into lessons (
        course_week_id,
        title,
        lesson_type,
        display_order,
        description,
        status,
        created_at
      )
      values ($1, $2, $3, $4, $5, $6, now())
      returning *
    `;
        const values = [
            weekId,
            payload.title,
            payload.lesson_type,
            payload.display_order,
            payload.description || null,
            payload.status || "draft"
        ];
        const result = await postgres_1.pool.query(query, values);
        return result.rows[0];
    }
    async findLessonById(lessonId) {
        const query = `
      select *
      from lessons
      where id = $1
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [lessonId]);
        return result.rows[0] || null;
    }
    async listQuizzesByWeek(weekId) {
        const query = `
      select *
      from quizzes
      where course_week_id = $1
      order by created_at asc
    `;
        const result = await postgres_1.pool.query(query, [weekId]);
        return result.rows;
    }
    async createQuiz(weekId, payload) {
        const query = `
      insert into quizzes (
        course_week_id,
        title,
        quiz_type,
        time_limit_minutes,
        max_attempts,
        passing_score,
        status,
        created_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, now())
      returning *
    `;
        const values = [
            weekId,
            payload.title,
            payload.quiz_type,
            payload.time_limit_minutes || null,
            payload.max_attempts || null,
            payload.passing_score || null,
            payload.status || "draft"
        ];
        const result = await postgres_1.pool.query(query, values);
        return result.rows[0];
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
    async listHomeworksByWeek(weekId) {
        const query = `
      select *
      from homework_sheets
      where course_week_id = $1
      order by created_at asc
    `;
        const result = await postgres_1.pool.query(query, [weekId]);
        return result.rows;
    }
    async createHomework(weekId, payload) {
        const query = `
      insert into homework_sheets (
        course_week_id,
        title,
        description,
        attachment_file_id,
        due_at,
        status,
        created_at
      )
      values ($1, $2, $3, $4, $5, $6, now())
      returning *
    `;
        const values = [
            weekId,
            payload.title,
            payload.description || null,
            payload.attachment_file_id || null,
            payload.due_at || null,
            payload.status || "draft"
        ];
        const result = await postgres_1.pool.query(query, values);
        return result.rows[0];
    }
    async listWeekOverview(weekId) {
        const [weekResult, lessonsResult, quizzesResult, homeworksResult] = await Promise.all([
            postgres_1.pool.query(`select * from course_weeks where id = $1 limit 1`, [weekId]),
            postgres_1.pool.query(`select * from lessons where course_week_id = $1 order by display_order asc`, [weekId]),
            postgres_1.pool.query(`select * from quizzes where course_week_id = $1 order by created_at asc`, [weekId]),
            postgres_1.pool.query(`select * from homework_sheets where course_week_id = $1 order by created_at asc`, [weekId])
        ]);
        return {
            week: weekResult.rows[0] || null,
            lessons: lessonsResult.rows,
            quizzes: quizzesResult.rows,
            homeworks: homeworksResult.rows
        };
    }
}
exports.CccRepository = CccRepository;
