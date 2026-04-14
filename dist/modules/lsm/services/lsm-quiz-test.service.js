"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LsmQuizTestService = void 0;
const lsm_mapper_1 = require("./lsm.mapper");
class LsmQuizTestService {
    constructor(repo) {
        this.repo = repo;
    }
    async getStudentTaskQuizeTest(studentId, classCode, taskCode) {
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
        const title = contentItemRow.title ?? null;
        if (!contentId) {
            return {
                student_id: studentId,
                class_code: classCode,
                task_code: taskCode,
                content_type: taskContentType,
                class_info: classInfo,
                task_info: taskInfo,
                task_statistics: taskStatistics,
                quiz_test: {
                    content_id: null,
                    title,
                    quiz_test: null,
                    questions: []
                }
            };
        }
        const [quizTestRow, quizTestQuestionRows] = await Promise.all([
            this.repo.findQuizTestById(contentId),
            this.repo.findQuizTestQuestionsByQuizTestId(contentId)
        ]);
        const questionIds = Array.from(new Set(quizTestQuestionRows
            .map((row) => row.quiz_question_id)
            .filter((id) => id !== null && id !== undefined)
            .map((id) => String(id))));
        const questionRows = await this.repo.findQuizQuestionsByIds(questionIds);
        const questionMap = new Map();
        for (const row of questionRows) {
            questionMap.set(String(row.id), row);
        }
        const questions = quizTestQuestionRows.map((row) => {
            const questionRow = row.quiz_question_id !== null && row.quiz_question_id !== undefined
                ? questionMap.get(String(row.quiz_question_id)) ?? null
                : null;
            const questionInfo = (0, lsm_mapper_1.toQuizQuestionInfo)(questionRow);
            return {
                id: questionInfo?.id ??
                    (row.quiz_question_id !== null && row.quiz_question_id !== undefined
                        ? String(row.quiz_question_id)
                        : String(row.id)),
                question_text: questionInfo?.question_text ?? null,
                question_type: questionInfo?.question_type ?? null,
                options: questionInfo?.options ?? null,
                correct_answer: questionInfo?.correct_answer ?? null,
                explanation: questionInfo?.explanation ?? null,
                default_score: questionInfo?.default_score ?? null,
                difficulty_level: questionInfo?.difficulty_level ?? null,
                display_order: (0, lsm_mapper_1.toNullableNumber)(row.display_order),
                score: (0, lsm_mapper_1.toNullableNumber)(row.score),
                is_required: Boolean(row.is_required)
            };
        });
        return {
            student_id: studentId,
            class_code: classCode,
            task_code: taskCode,
            content_type: taskContentType,
            class_info: classInfo,
            task_info: taskInfo,
            task_statistics: taskStatistics,
            quiz_test: {
                content_id: contentId,
                title,
                quiz_test: (0, lsm_mapper_1.toQuizTestInfo)(quizTestRow),
                questions
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
            quiz_test: null
        };
    }
}
exports.LsmQuizTestService = LsmQuizTestService;
