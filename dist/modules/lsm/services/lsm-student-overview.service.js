"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LsmStudentOverviewService = void 0;
const lsm_mapper_1 = require("./lsm.mapper");
class LsmStudentOverviewService {
    constructor(repo) {
        this.repo = repo;
    }
    async getStudentCoursesWithPendingWeeks(studentId) {
        const [courseRows, pendingWeekRows] = await Promise.all([
            this.repo.findStudentCourseInfos(studentId),
            this.repo.findStudentPendingWeeks(studentId)
        ]);
        const courseMap = new Map();
        for (const row of courseRows) {
            courseMap.set(String(row.class_id), {
                avatar_url: row.avatar_url ?? null,
                class_name: row.class_name ?? null,
                class_code: row.class_code ?? null,
                slogan: row.slogan ?? null,
                pending_weeks: []
            });
        }
        for (const row of pendingWeekRows) {
            const classId = String(row.class_id);
            if (!courseMap.has(classId)) {
                courseMap.set(classId, {
                    avatar_url: null,
                    class_name: null,
                    class_code: null,
                    slogan: null,
                    pending_weeks: []
                });
            }
            const pendingWeek = {
                class_week_id: String(row.class_week_id),
                week_no: (0, lsm_mapper_1.toNullableNumber)(row.week_no),
                title: row.title ?? null,
                total_student_done: Number(row.total_student_done || 0),
                total_student_assigned: Number(row.total_student_assigned || 0)
            };
            courseMap.get(classId).pending_weeks.push(pendingWeek);
        }
        return {
            student_id: studentId,
            courses: Array.from(courseMap.values())
        };
    }
    async getRecentStudentEvents(studentId, limit = 10) {
        const rows = await this.repo.findRecentStudentEvents(studentId, limit);
        const items = rows.map((row) => ({
            event_name: row.event_name ?? null,
            description: row.description ?? null,
            start_time: row.start_time ?? null
        }));
        return { student_id: studentId, items };
    }
    async getRecentClassEvents(classId, limit = 10) {
        const rows = await this.repo.findRecentClassEvents(classId, limit);
        const items = rows.map((row) => ({
            student_id: String(row.student_id),
            status: row.status ?? null,
            score: (0, lsm_mapper_1.toNullableNumber)(row.score)
        }));
        return { class_id: classId, items };
    }
}
exports.LsmStudentOverviewService = LsmStudentOverviewService;
