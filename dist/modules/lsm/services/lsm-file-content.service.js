"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LsmFileContentService = void 0;
const lsm_mapper_1 = require("./lsm.mapper");
class LsmFileContentService {
    constructor(repo) {
        this.repo = repo;
    }
    async getStudentTaskFileContent(studentId, classCode, taskCode) {
        const [classInfoRow, taskRow, taskStatisticsRow] = await Promise.all([
            this.repo.findClassCourseInfoByClassCode(classCode),
            this.repo.findStudentTaskByTaskCode(studentId, classCode, taskCode),
            this.repo.findTaskStatisticsByTaskCode(studentId, classCode, taskCode)
        ]);
        const classInfo = (0, lsm_mapper_1.toClassCourseInfo)(classInfoRow);
        const taskInfo = (0, lsm_mapper_1.toTaskInfo)(taskRow);
        const taskStatistics = this.toTaskStatistics(taskStatisticsRow);
        const taskContentType = taskRow?.content_type ?? null;
        if (!taskRow) {
            return this.buildEmpty(studentId, classCode, taskCode, taskContentType, classInfo, null, taskStatistics);
        }
        const sourceType = taskRow.source_type ?? null;
        const sourceId = taskRow.source_id !== null && taskRow.source_id !== undefined
            ? String(taskRow.source_id)
            : null;
        if (!sourceType || !sourceId) {
            return this.buildEmpty(studentId, classCode, taskCode, taskContentType, classInfo, taskInfo, taskStatistics);
        }
        const contentItemRow = await this.findContentItem(studentId, sourceType, sourceId);
        if (!contentItemRow) {
            return this.buildEmpty(studentId, classCode, taskCode, taskContentType, classInfo, taskInfo, taskStatistics);
        }
        const contentId = contentItemRow.content_id !== null && contentItemRow.content_id !== undefined
            ? String(contentItemRow.content_id)
            : null;
        if (!contentId) {
            return {
                student_id: studentId,
                class_code: classCode,
                task_code: taskCode,
                content_type: taskContentType,
                class_info: classInfo,
                task_info: taskInfo,
                task_statistics: taskStatistics,
                file_content: {
                    content_id: null,
                    file: null
                }
            };
        }
        const fileRow = await this.repo.findContentFileById(contentId);
        return {
            student_id: studentId,
            class_code: classCode,
            task_code: taskCode,
            content_type: taskContentType,
            class_info: classInfo,
            task_info: taskInfo,
            task_statistics: taskStatistics,
            file_content: {
                content_id: contentId,
                file: (0, lsm_mapper_1.toContentFileInfo)(fileRow)
            }
        };
    }
    async findContentItem(studentId, sourceType, sourceId) {
        if (sourceType === "class_week_content_item") {
            return this.repo.findClassWeekContentItemById(sourceId);
        }
        if (sourceType === "student_class_week_content_item") {
            return this.repo.findStudentClassWeekContentItemById(studentId, sourceId);
        }
        return null;
    }
    toTaskStatistics(row) {
        return {
            section_type: row?.section_type ?? null,
            class_id: row?.class_id !== null && row?.class_id !== undefined
                ? String(row.class_id)
                : null,
            class_week_id: row?.class_week_id !== null && row?.class_week_id !== undefined
                ? String(row.class_week_id)
                : null,
            total_student_assigned: Number(row?.total_student_assigned || 0),
            total_student_completed: Number(row?.total_student_completed || 0),
            highest_score: (0, lsm_mapper_1.toNullableNumber)(row?.highest_score)
        };
    }
    buildEmpty(studentId, classCode, taskCode, contentType, classInfo, taskInfo, taskStatistics) {
        return {
            student_id: studentId,
            class_code: classCode,
            task_code: taskCode,
            content_type: contentType,
            class_info: classInfo,
            task_info: taskInfo,
            task_statistics: taskStatistics,
            file_content: null
        };
    }
}
exports.LsmFileContentService = LsmFileContentService;
