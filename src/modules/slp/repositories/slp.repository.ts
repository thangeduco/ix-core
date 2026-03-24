import { pool } from "../../../shared/db/postgres";

export class SlpRepository {

  async aggregateStudentScores(courseId: string, weekId?: string) {
    const conditions = ["1=1"];
    const values: any[] = [];

    values.push(courseId);
    conditions.push(`course_id = $${values.length}`);

    if (weekId) {
      values.push(weekId);
      conditions.push(`course_week_id = $${values.length}`);
    }

    const query = `
      select 
        student_user_id,
        sum(score) as total_score
      from student_scores
      where ${conditions.join(" and ")}
      group by student_user_id
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  async saveRanking(records: any[]) {
    for (const r of records) {
      const query = `
        insert into ranking_records (
          student_user_id,
          scope,
          scope_id,
          period,
          course_id,
          course_week_id,
          rank,
          score,
          created_at
        )
        values ($1,$2,$3,$4,$5,$6,$7,$8,now())
      `;
      await pool.query(query, [
        r.student_user_id,
        r.scope,
        r.scope_id,
        r.period,
        r.course_id,
        r.course_week_id,
        r.rank,
        r.score
      ]);
    }
  }

  async getRanking(queryParams: any) {
    const query = `
      select *
      from ranking_records
      where scope = $1
        and period = $2
        and course_id = $3
        and (scope_id = $4 or $4 is null)
        and (course_week_id = $5 or $5 is null)
      order by rank asc
    `;
    const result = await pool.query(query, [
      queryParams.scope,
      queryParams.period,
      queryParams.course_id,
      queryParams.scope_id || null,
      queryParams.week_id || null
    ]);
    return result.rows;
  }

  async getStudentRankingHistory(studentUserId: string) {
    const query = `
      select *
      from ranking_records
      where student_user_id = $1
      order by created_at desc
    `;
    const result = await pool.query(query, [studentUserId]);
    return result.rows;
  }
}
