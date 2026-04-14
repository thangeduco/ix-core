"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LsmProgressService = void 0;
const lsm_mapper_1 = require("./lsm.mapper");
class LsmProgressService {
    constructor(repo, getTaskStatus, getPreviousWeekNo) {
        this.repo = repo;
        this.getTaskStatus = getTaskStatus;
        this.getPreviousWeekNo = getPreviousWeekNo;
    }
    async getStudentWeeklyTasks(studentId, classCode, weekNo) {
        const rows = await this.repo.findStudentWeeklyTasks(studentId, classCode, weekNo);
        const items = await Promise.all(rows.map(async (row) => {
            const taskCode = row.task_code ?? null;
            const taskStatistics = taskCode
                ? await this.repo.findTaskStatisticsByTaskCode(studentId, classCode, taskCode)
                : null;
            return {
                task_code: taskCode,
                task_title: row.task_title ?? null,
                section_type: row.section_type ?? null,
                content_type: row.content_type ?? null,
                task_status: this.getTaskStatus(row.assign_status),
                task_next_action: row.task_next_action ?? null,
                display_order: (0, lsm_mapper_1.toNullableNumber)(row.display_order),
                total_student_completed: Number(taskStatistics?.total_student_completed || 0)
            };
        }));
        return { student_id: studentId, class_code: classCode, week_no: weekNo, items };
    }
    async getWeekProgress(studentId, classCode, weekNo) {
        const row = await this.repo.findWeekProgressSummary(studentId, classCode, weekNo);
        const totalTasks = Number(row?.total_tasks || 0);
        const totalUnfinishedTasks = Number(row?.total_unfinished_tasks || 0);
        const progressPercent = totalTasks > 0
            ? Number((((totalTasks - totalUnfinishedTasks) / totalTasks) * 100).toFixed(2))
            : 0;
        return {
            class_week_id: row?.class_week_id ? String(row.class_week_id) : null,
            total_unfinished_tasks: totalUnfinishedTasks,
            total_tasks: totalTasks,
            progress_percent: progressPercent
        };
    }
    async getStudentWeekRankings(studentId, classCode, weekNo) {
        const row = await this.repo.findStudentWeekRankings(studentId, classCode, weekNo);
        return {
            week_score_ranking: (0, lsm_mapper_1.toNullableNumber)(row?.week_score_ranking),
            total_week_stickers_ranking: (0, lsm_mapper_1.toNullableNumber)(row?.total_week_stickers_ranking),
            homework_score_ranking: (0, lsm_mapper_1.toNullableNumber)(row?.homework_score_ranking),
            extra_assignment_score_ranking: (0, lsm_mapper_1.toNullableNumber)(row?.extra_assignment_score_ranking),
            preparation_score_ranking: (0, lsm_mapper_1.toNullableNumber)(row?.preparation_score_ranking),
            in_class_score_ranking: (0, lsm_mapper_1.toNullableNumber)(row?.in_class_score_ranking)
        };
    }
    async getStudentClassWeekResultWithRankings(studentId, classCode, weekNo) {
        const [resultRow, rankingRow] = await Promise.all([
            this.repo.findStudentClassWeekResultByWeekNo(studentId, classCode, weekNo),
            this.getStudentWeekRankings(studentId, classCode, weekNo)
        ]);
        return resultRow ? (0, lsm_mapper_1.toStudentClassWeekResult)(resultRow, rankingRow) : null;
    }
    async getPreviousWeekResult(studentId, classCode) {
        const currentWeekNo = await this.repo.findCurrentClassWeekNo(classCode);
        const previousWeekNo = this.getPreviousWeekNo(currentWeekNo);
        if (previousWeekNo === null) {
            return {
                student_id: studentId,
                class_code: classCode,
                current_week_no: currentWeekNo,
                previous_week_no: null,
                result: null
            };
        }
        return {
            student_id: studentId,
            class_code: classCode,
            current_week_no: currentWeekNo,
            previous_week_no: previousWeekNo,
            result: await this.getStudentClassWeekResultWithRankings(studentId, classCode, previousWeekNo)
        };
    }
    async getPreviousWeekResultByWeekNo(studentId, classCode, weekNo) {
        const previousWeekNo = this.getPreviousWeekNo(weekNo);
        if (previousWeekNo === null) {
            return {
                student_id: studentId,
                class_code: classCode,
                requested_week_no: weekNo,
                previous_week_no: null,
                result: null
            };
        }
        return {
            student_id: studentId,
            class_code: classCode,
            requested_week_no: weekNo,
            previous_week_no: previousWeekNo,
            result: await this.getStudentClassWeekResultWithRankings(studentId, classCode, previousWeekNo)
        };
    }
    async getDashboardWeekData(studentId, classCode, weekNo) {
        const previousWeekNo = this.getPreviousWeekNo(weekNo);
        const [tasksResponse, progressResponse, previousWeekRow, previousWeekResult] = await Promise.all([
            this.getStudentWeeklyTasks(studentId, classCode, weekNo),
            this.getWeekProgress(studentId, classCode, weekNo),
            previousWeekNo !== null
                ? this.repo.findClassWeekByWeekNo(classCode, previousWeekNo)
                : Promise.resolve(null),
            previousWeekNo !== null
                ? this.getStudentClassWeekResultWithRankings(studentId, classCode, previousWeekNo)
                : Promise.resolve(null)
        ]);
        return {
            current_week_tasks: tasksResponse.items,
            current_week_progress: progressResponse,
            previous_week: (0, lsm_mapper_1.toClassWeekItem)(previousWeekRow),
            previous_week_result: previousWeekResult
        };
    }
    async getDashboard(studentId, classCode) {
        const [classInfoRow, currentWeekNo] = await Promise.all([
            this.repo.findClassCourseInfoByClassCode(classCode),
            this.repo.findCurrentClassWeekNo(classCode)
        ]);
        const classInfo = (0, lsm_mapper_1.toClassCourseInfo)(classInfoRow);
        if (currentWeekNo === null) {
            return this.buildEmptyDashboard(studentId, classCode, classInfo, "CURRENT", null, null);
        }
        const currentWeek = (0, lsm_mapper_1.toClassWeekItem)(await this.repo.findClassWeekByWeekNo(classCode, currentWeekNo));
        if (!currentWeek) {
            return this.buildEmptyDashboard(studentId, classCode, classInfo, "CURRENT", null, currentWeekNo);
        }
        const weekData = await this.getDashboardWeekData(studentId, classCode, currentWeekNo);
        return {
            student_id: studentId,
            class_code: classCode,
            class_info: classInfo,
            reference_context: { mode: "CURRENT", requested_week_no: null, resolved_week_no: currentWeekNo },
            current_week: currentWeek,
            current_week_tasks: weekData.current_week_tasks,
            current_week_progress: weekData.current_week_progress,
            previous_week: weekData.previous_week,
            previous_week_result: weekData.previous_week_result
        };
    }
    async getDashboardByWeekNo(studentId, classCode, weekNo) {
        const [classInfoRow, currentWeekRow] = await Promise.all([
            this.repo.findClassCourseInfoByClassCode(classCode),
            this.repo.findClassWeekByWeekNo(classCode, weekNo)
        ]);
        const classInfo = (0, lsm_mapper_1.toClassCourseInfo)(classInfoRow);
        const currentWeek = (0, lsm_mapper_1.toClassWeekItem)(currentWeekRow);
        if (!currentWeek?.week_no) {
            return this.buildEmptyDashboard(studentId, classCode, classInfo, "BY_WEEK_NO", weekNo, null, currentWeek);
        }
        const weekData = await this.getDashboardWeekData(studentId, classCode, currentWeek.week_no);
        return {
            student_id: studentId,
            class_code: classCode,
            class_info: classInfo,
            reference_context: {
                mode: "BY_WEEK_NO",
                requested_week_no: weekNo,
                resolved_week_no: currentWeek.week_no
            },
            current_week: currentWeek,
            current_week_tasks: weekData.current_week_tasks,
            current_week_progress: weekData.current_week_progress,
            previous_week: weekData.previous_week,
            previous_week_result: weekData.previous_week_result
        };
    }
    buildEmptyDashboard(studentId, classCode, classInfo, mode, requestedWeekNo, resolvedWeekNo, currentWeek = null) {
        return {
            student_id: studentId,
            class_code: classCode,
            class_info: classInfo,
            reference_context: {
                mode,
                requested_week_no: requestedWeekNo,
                resolved_week_no: resolvedWeekNo
            },
            current_week: currentWeek,
            current_week_tasks: [],
            current_week_progress: null,
            previous_week: null,
            previous_week_result: null
        };
    }
}
exports.LsmProgressService = LsmProgressService;
