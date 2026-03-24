import { SlpRepository } from "../repositories/slp.repository";

type AggregateStudentScore = {
  student_user_id: string;
  total_score: number | string;
};

type RankingItem = {
  student_user_id: string;
  scope: string;
  scope_id: string | null;
  period: string;
  course_id: string;
  course_week_id: string | null;
  rank: number;
  score: number;
};

export class SlpService {
  private repo = new SlpRepository();

  async calculateRanking(payload: {
    scope: string;
    scope_id?: string;
    period: string;
    course_id: string;
    week_id?: string;
  }) {
    const scores = (await this.repo.aggregateStudentScores(
      payload.course_id,
      payload.week_id
    )) as AggregateStudentScore[];

    const sorted = scores.sort(
      (a: AggregateStudentScore, b: AggregateStudentScore) =>
        Number(b.total_score) - Number(a.total_score)
    );

    const ranking: RankingItem[] = sorted.map(
      (s: AggregateStudentScore, index: number) => ({
        student_user_id: s.student_user_id,
        scope: payload.scope,
        scope_id: payload.scope_id || null,
        period: payload.period,
        course_id: payload.course_id,
        course_week_id: payload.week_id || null,
        rank: index + 1,
        score: Number(s.total_score)
      })
    );

    await this.repo.saveRanking(ranking);

    return ranking;
  }

  async getRanking(query: any) {
    return this.repo.getRanking(query);
  }

  async compareRanking(studentUserId: string) {
    const history = await this.repo.getStudentRankingHistory(studentUserId);
    return history;
  }
}