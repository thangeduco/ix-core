import { LsmRepository } from "../repositories/lsm.repository";
import {
  LsmStudentTaskQuizQuestionItem,
  LsmStudentTaskQuizTestResponse,
  LsmStudentTaskStatistics
} from "../types/lsm.types";
import {
  toClassCourseInfo,
  toNullableNumber,
  toQuizQuestionInfo,
  toQuizTestInfo,
  toTaskInfo
} from "./lsm.mapper";

export class LsmQuizTestService {
  constructor(private readonly repo: LsmRepository) {}

  async getStudentTaskQuizeTest(
    studentId: string,
    classCode: string,
    taskCode: string
  ): Promise<LsmStudentTaskQuizTestResponse> {
    const [classInfoRow, taskRow, taskStatisticsRow] = await Promise.all([
      this.repo.findClassCourseInfoByClassCode(classCode),
      this.repo.findStudentTaskByTaskCode(studentId, classCode, taskCode),
      this.repo.findTaskStatisticsByTaskCode(studentId, classCode, taskCode)
    ]);

    const classInfo = toClassCourseInfo(classInfoRow);
    const taskInfo = toTaskInfo(taskRow);
    const taskStatistics = this.toTaskStatistics(taskStatisticsRow);
    const taskContentType = taskRow?.content_type ?? null;

    if (!taskRow) {
      return this.buildEmpty(
        studentId,
        classCode,
        taskCode,
        taskContentType,
        classInfo,
        null,
        taskStatistics
      );
    }

    const sourceType = taskRow.source_type ?? null;
    const sourceId =
      taskRow.source_id !== null && taskRow.source_id !== undefined
        ? String(taskRow.source_id)
        : null;

    if (!sourceType || !sourceId) {
      return this.buildEmpty(
        studentId,
        classCode,
        taskCode,
        taskContentType,
        classInfo,
        taskInfo,
        taskStatistics
      );
    }

    const contentItemRow = await this.findContentItem(studentId, sourceType, sourceId);
    if (!contentItemRow) {
      return this.buildEmpty(
        studentId,
        classCode,
        taskCode,
        taskContentType,
        classInfo,
        taskInfo,
        taskStatistics
      );
    }

    const contentId =
      contentItemRow.content_id !== null && contentItemRow.content_id !== undefined
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

    const questionIds = Array.from(
      new Set(
        quizTestQuestionRows
          .map((row: any) => row.quiz_question_id)
          .filter((id: any) => id !== null && id !== undefined)
          .map((id: any) => String(id))
      )
    );

    const questionRows = await this.repo.findQuizQuestionsByIds(questionIds);
    const questionMap = new Map<string, any>();

    for (const row of questionRows) {
      questionMap.set(String(row.id), row);
    }

    const questions: LsmStudentTaskQuizQuestionItem[] = quizTestQuestionRows.map(
      (row: any) => {
        const questionRow =
          row.quiz_question_id !== null && row.quiz_question_id !== undefined
            ? questionMap.get(String(row.quiz_question_id)) ?? null
            : null;

        const questionInfo = toQuizQuestionInfo(questionRow);

        return {
          id:
            questionInfo?.id ??
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
          display_order: toNullableNumber(row.display_order),
          score: toNullableNumber(row.score),
          is_required: Boolean(row.is_required)
        };
      }
    );

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
        quiz_test: toQuizTestInfo(quizTestRow),
        questions
      }
    };
  }

  private async findContentItem(studentId: string, sourceType: string, sourceId: string) {
    if (sourceType === "class_week_content_item") {
      return this.repo.findClassWeekContentItemById(sourceId);
    }

    if (sourceType === "student_class_week_content_item") {
      return this.repo.findStudentClassWeekContentItemById(studentId, sourceId);
    }

    return null;
  }

  private toTaskStatistics(row: any): LsmStudentTaskStatistics {
    return {
      section_type: row?.section_type ?? null,
      class_id:
        row?.class_id !== null && row?.class_id !== undefined
          ? String(row.class_id)
          : null,
      class_week_id:
        row?.class_week_id !== null && row?.class_week_id !== undefined
          ? String(row.class_week_id)
          : null,
      total_student_assigned: Number(row?.total_student_assigned || 0),
      total_student_completed: Number(row?.total_student_completed || 0),
      highest_score: toNullableNumber(row?.highest_score)
    };
  }

  private buildEmpty(
    studentId: string,
    classCode: string,
    taskCode: string,
    contentType: string | null,
    classInfo: any,
    taskInfo: any,
    taskStatistics: LsmStudentTaskStatistics
  ): LsmStudentTaskQuizTestResponse {
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