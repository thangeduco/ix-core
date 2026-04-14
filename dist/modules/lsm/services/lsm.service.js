"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LsmService = void 0;
const lsm_repository_1 = require("../repositories/lsm.repository");
const lsm_progress_service_1 = require("./lsm-progress.service");
const lsm_student_overview_service_1 = require("./lsm-student-overview.service");
const lsm_video_lecture_service_1 = require("./lsm-video-lecture.service");
const lsm_file_content_service_1 = require("./lsm-file-content.service");
const lsm_quiz_test_service_1 = require("./lsm-quiz-test.service");
class LsmService {
    constructor() {
        this.repo = new lsm_repository_1.LsmRepository();
        this.overviewService = new lsm_student_overview_service_1.LsmStudentOverviewService(this.repo);
        this.progressService = new lsm_progress_service_1.LsmProgressService(this.repo, this.getTaskStatus.bind(this), this.getPreviousWeekNo.bind(this));
        this.videoLectureService = new lsm_video_lecture_service_1.LsmVideoLectureService(this.repo);
        this.fileContentService = new lsm_file_content_service_1.LsmFileContentService(this.repo);
        this.quizTestService = new lsm_quiz_test_service_1.LsmQuizTestService(this.repo);
    }
    async getStudentCoursesWithPendingWeeks(studentId) {
        return this.overviewService.getStudentCoursesWithPendingWeeks(studentId);
    }
    async getRecentStudentEvents(studentId, limit = 10) {
        return this.overviewService.getRecentStudentEvents(studentId, limit);
    }
    async getRecentClassEvents(classId, limit = 10) {
        return this.overviewService.getRecentClassEvents(classId, limit);
    }
    getPreviousWeekNo(currentWeekNo) {
        if (currentWeekNo === null || currentWeekNo === undefined) {
            return null;
        }
        return currentWeekNo > 1 ? currentWeekNo - 1 : null;
    }
    getTaskStatus(assignStatus) {
        if (assignStatus === "assigned" || assignStatus === "redo_required") {
            return "NEED_STUDENT_DO";
        }
        if (assignStatus === "in_progress") {
            return "NEED_STUDENT_CONTINUE";
        }
        if (assignStatus === "submitted_for_review" ||
            assignStatus === "done" ||
            assignStatus === "reviewed_ok") {
            return "STUDENT_DONE";
        }
        return "NO_NEED_STUDENT_DO";
    }
    async getStudentWeeklyTasks(studentId, classCode, weekNo) {
        return this.progressService.getStudentWeeklyTasks(studentId, classCode, weekNo);
    }
    async getWeekProgress(studentId, classCode, weekNo) {
        return this.progressService.getWeekProgress(studentId, classCode, weekNo);
    }
    async getPreviousWeekResult(studentId, classCode) {
        return this.progressService.getPreviousWeekResult(studentId, classCode);
    }
    async getPreviousWeekResultByWeekNo(studentId, classCode, weekNo) {
        return this.progressService.getPreviousWeekResultByWeekNo(studentId, classCode, weekNo);
    }
    async getDashboard(studentId, classCode) {
        return this.progressService.getDashboard(studentId, classCode);
    }
    async getDashboardByWeekNo(studentId, classCode, weekNo) {
        return this.progressService.getDashboardByWeekNo(studentId, classCode, weekNo);
    }
    async getStudentTaskVideoLecture(studentId, classCode, taskCode) {
        return this.videoLectureService.getStudentTaskVideoLecture(studentId, classCode, taskCode);
    }
    async getStudentTaskFileContent(studentId, classCode, taskCode) {
        return this.fileContentService.getStudentTaskFileContent(studentId, classCode, taskCode);
    }
    async getStudentTaskQuizeTest(studentId, classCode, taskCode) {
        return this.quizTestService.getStudentTaskQuizeTest(studentId, classCode, taskCode);
    }
    async getStudentTaskContent(studentId, classCode, taskCode) {
        const [classInfoRow, taskStatisticsRow, taskRow] = await Promise.all([
            this.repo.findClassCourseInfoByClassCode(classCode),
            this.repo.findTaskStatisticsByTaskCode(studentId, classCode, taskCode),
            this.repo.findStudentTaskByTaskCode(studentId, classCode, taskCode)
        ]);
        const contentType = taskRow?.content_type ?? null;
        if (contentType === "VIDEO") {
            return this.videoLectureService.getStudentTaskVideoLecture(studentId, classCode, taskCode);
        }
        if (contentType === "FILE") {
            return this.fileContentService.getStudentTaskFileContent(studentId, classCode, taskCode);
        }
        if (contentType === "QUIZ_TEST") {
            return this.quizTestService.getStudentTaskQuizeTest(studentId, classCode, taskCode);
        }
        return {
            student_id: studentId,
            class_code: classCode,
            task_code: taskCode,
            content_type: contentType,
            class_info: classInfoRow
                ? {
                    avatar_url: classInfoRow.avatar_url ?? null,
                    class_name: classInfoRow.class_name ?? null,
                    class_code: classInfoRow.class_code ?? null,
                    slogan: classInfoRow.slogan ?? null
                }
                : null,
            task_info: taskRow
                ? {
                    task_code: String(taskRow.task_code),
                    task_title: taskRow.task_title ?? null,
                    content_type: taskRow.content_type ?? null
                }
                : null,
            task_statistics: {
                section_type: taskStatisticsRow?.section_type ?? null,
                class_id: taskStatisticsRow?.class_id !== null &&
                    taskStatisticsRow?.class_id !== undefined
                    ? String(taskStatisticsRow.class_id)
                    : null,
                class_week_id: taskStatisticsRow?.class_week_id !== null &&
                    taskStatisticsRow?.class_week_id !== undefined
                    ? String(taskStatisticsRow.class_week_id)
                    : null,
                total_student_assigned: Number(taskStatisticsRow?.total_student_assigned || 0),
                total_student_completed: Number(taskStatisticsRow?.total_student_completed || 0),
                highest_score: taskStatisticsRow?.highest_score !== null &&
                    taskStatisticsRow?.highest_score !== undefined
                    ? Number(taskStatisticsRow.highest_score)
                    : null
            },
            file_content: null
        };
    }
}
exports.LsmService = LsmService;
