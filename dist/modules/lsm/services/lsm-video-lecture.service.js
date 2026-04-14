"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LsmVideoLectureService = void 0;
const lsm_mapper_1 = require("./lsm.mapper");
class LsmVideoLectureService {
    constructor(repo) {
        this.repo = repo;
    }
    async getStudentTaskVideoLecture(studentId, classCode, taskCode) {
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
        const contentType = contentItemRow.content_type ?? null;
        if (contentType !== "LECTURE_VIDEO") {
            return this.buildEmpty(studentId, classCode, taskCode, taskContentType, classInfo, taskInfo, taskStatistics);
        }
        const contentId = contentItemRow.content_id !== null && contentItemRow.content_id !== undefined
            ? String(contentItemRow.content_id)
            : null;
        const videoTitle = contentItemRow.title ?? null;
        if (!contentId) {
            return {
                student_id: studentId,
                class_code: classCode,
                task_code: taskCode,
                content_type: taskContentType,
                class_info: classInfo,
                task_info: taskInfo,
                task_statistics: taskStatistics,
                video_title: videoTitle,
                video_id: null,
                lecture_video: null,
                quiz_events: []
            };
        }
        const [lectureVideoRow, eventRows] = await Promise.all([
            this.repo.findLectureVideoById(contentId),
            this.repo.findVideoQuizEventsByLectureVideoId(contentId)
        ]);
        const lectureVideo = (0, lsm_mapper_1.toLectureVideoInfo)(lectureVideoRow);
        if (!eventRows.length) {
            return {
                student_id: studentId,
                class_code: classCode,
                task_code: taskCode,
                content_type: taskContentType,
                class_info: classInfo,
                task_info: taskInfo,
                task_statistics: taskStatistics,
                video_title: videoTitle,
                video_id: contentId,
                lecture_video: lectureVideo,
                quiz_events: []
            };
        }
        const actualEventQuestionRows = await this.repo.findVideoQuizEventQuestionsByEventIds(eventRows.map((row) => String(row.id)));
        const questionMap = await this.buildQuestionMap(actualEventQuestionRows);
        const questionsByEventId = new Map();
        for (const row of actualEventQuestionRows) {
            const eventId = String(row.video_quiz_event_id);
            const item = this.toQuizEventQuestionItem(row, questionMap);
            if (!questionsByEventId.has(eventId)) {
                questionsByEventId.set(eventId, []);
            }
            questionsByEventId.get(eventId).push(item);
        }
        const quizEvents = eventRows.map((row) => ({
            id: String(row.id),
            lecture_video_id: String(row.lecture_video_id),
            title: row.title ?? null,
            description: row.description ?? null,
            trigger_second: (0, lsm_mapper_1.toNullableNumber)(row.trigger_second),
            pause_video: Boolean(row.pause_video),
            is_required: Boolean(row.is_required),
            questions: questionsByEventId.get(String(row.id)) ?? []
        }));
        return {
            student_id: studentId,
            class_code: classCode,
            task_code: taskCode,
            content_type: taskContentType,
            class_info: classInfo,
            task_info: taskInfo,
            task_statistics: taskStatistics,
            video_title: videoTitle,
            video_id: contentId,
            lecture_video: lectureVideo,
            quiz_events: quizEvents
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
    async buildQuestionMap(eventQuestionRows) {
        const uniqueQuestionIds = Array.from(new Set(eventQuestionRows
            .flatMap((row) => [
            row.quiz_question_id,
            row.next_correct_question_id,
            row.next_fail_question_id
        ])
            .filter((id) => id !== null && id !== undefined)
            .map((id) => String(id))));
        if (uniqueQuestionIds.length >= 50) {
            throw new Error(`Video lecture task has ${uniqueQuestionIds.length} quiz questions. Maximum allowed per request is less than 50.`);
        }
        const quizQuestionRows = await this.repo.findQuizQuestionsByIds(uniqueQuestionIds);
        const questionMap = new Map();
        for (const row of quizQuestionRows) {
            questionMap.set(String(row.id), (0, lsm_mapper_1.toQuizQuestionInfo)(row));
        }
        return questionMap;
    }
    toQuizEventQuestionItem(row, questionMap) {
        const getQuestion = (id) => id !== null && id !== undefined ? questionMap.get(String(id)) ?? null : null;
        return {
            id: String(row.id),
            video_quiz_event_id: String(row.video_quiz_event_id),
            quiz_question_id: row.quiz_question_id != null ? String(row.quiz_question_id) : null,
            is_start_question: Boolean(row.is_start_question),
            display_order: (0, lsm_mapper_1.toNullableNumber)(row.display_order),
            score: (0, lsm_mapper_1.toNullableNumber)(row.score),
            next_correct_question_id: row.next_correct_question_id != null ? String(row.next_correct_question_id) : null,
            next_fail_question_id: row.next_fail_question_id != null ? String(row.next_fail_question_id) : null,
            correct_action: row.correct_action ?? null,
            fail_action: row.fail_action ?? null,
            status: row.status ?? null,
            created_at: row.created_at ?? null,
            updated_at: row.updated_at ?? null,
            quiz_question: getQuestion(row.quiz_question_id),
            next_correct_question: getQuestion(row.next_correct_question_id),
            next_fail_question: getQuestion(row.next_fail_question_id)
        };
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
            video_title: null,
            video_id: null,
            lecture_video: null,
            quiz_events: []
        };
    }
}
exports.LsmVideoLectureService = LsmVideoLectureService;
