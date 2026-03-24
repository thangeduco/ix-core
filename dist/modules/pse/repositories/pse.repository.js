"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PseRepository = void 0;
const postgres_1 = require("../../../shared/db/postgres");
class PseRepository {
    async getWeeklyTasks(studentUserId, weekId) {
        const query = `
      select *
      from weekly_tasks
      where student_user_id = $1
        and course_week_id = $2
    `;
        const result = await postgres_1.pool.query(query, [studentUserId, weekId]);
        return result.rows;
    }
    async getWeeklySummary(studentUserId, weekId) {
        const query = `
      select 
        swp.*,
        wr.overall_comment,
        r.rank
      from student_week_progress swp
      left join weekly_reviews wr 
        on wr.student_user_id = swp.student_user_id 
        and wr.course_week_id = swp.course_week_id
      left join ranking_records r 
        on r.student_user_id = swp.student_user_id 
        and r.course_week_id = swp.course_week_id
      where swp.student_user_id = $1
        and swp.course_week_id = $2
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [studentUserId, weekId]);
        return result.rows[0] || null;
    }
    async getStudentRanking(studentUserId) {
        const query = `
      select *
      from ranking_records
      where student_user_id = $1
      order by created_at desc
    `;
        const result = await postgres_1.pool.query(query, [studentUserId]);
        return result.rows;
    }
    async getStudentGroups(studentUserId) {
        const query = `
      select g.*
      from groups g
      join group_members gm on gm.group_id = g.id
      where gm.user_id = $1
    `;
        const result = await postgres_1.pool.query(query, [studentUserId]);
        return result.rows;
    }
    async createParentTask(payload) {
        const query = `
      insert into parent_tasks (
        student_user_id,
        parent_user_id,
        title,
        description,
        status,
        created_at
      )
      values ($1,$2,$3,$4,'pending',now())
      returning *
    `;
        const result = await postgres_1.pool.query(query, [
            payload.student_user_id,
            payload.parent_user_id,
            payload.title,
            payload.description || null
        ]);
        return result.rows[0];
    }
    async updateParentTask(taskId, status) {
        const query = `
      update parent_tasks
      set status = $2,
          completed_at = case when $2 = 'completed' then now() else null end
      where id = $1
      returning *
    `;
        const result = await postgres_1.pool.query(query, [taskId, status]);
        return result.rows[0];
    }
    async getParentTasks(parentUserId) {
        const query = `
      select *
      from parent_tasks
      where parent_user_id = $1
      order by created_at desc
    `;
        const result = await postgres_1.pool.query(query, [parentUserId]);
        return result.rows;
    }
}
exports.PseRepository = PseRepository;
