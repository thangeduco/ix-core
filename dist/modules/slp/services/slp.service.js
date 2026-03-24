"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlpService = void 0;
const slp_repository_1 = require("../repositories/slp.repository");
class SlpService {
    constructor() {
        this.repo = new slp_repository_1.SlpRepository();
    }
    async calculateRanking(payload) {
        const scores = (await this.repo.aggregateStudentScores(payload.course_id, payload.week_id));
        const sorted = scores.sort((a, b) => Number(b.total_score) - Number(a.total_score));
        const ranking = sorted.map((s, index) => ({
            student_user_id: s.student_user_id,
            scope: payload.scope,
            scope_id: payload.scope_id || null,
            period: payload.period,
            course_id: payload.course_id,
            course_week_id: payload.week_id || null,
            rank: index + 1,
            score: Number(s.total_score)
        }));
        await this.repo.saveRanking(ranking);
        return ranking;
    }
    async getRanking(query) {
        return this.repo.getRanking(query);
    }
    async compareRanking(studentUserId) {
        const history = await this.repo.getStudentRankingHistory(studentUserId);
        return history;
    }
}
exports.SlpService = SlpService;
