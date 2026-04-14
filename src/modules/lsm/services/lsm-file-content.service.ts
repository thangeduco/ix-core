import { LsmRepository } from "../repositories/lsm.repository";
import {
  LsmStudentTaskFileResponse,
  LsmStudentTaskStatistics
} from "../types/lsm.types";
import {
  toClassCourseInfo,
  toContentFileInfo,
  toNullableNumber,
  toTaskInfo
} from "./lsm.mapper";

export class LsmFileContentService {
  constructor(private readonly repo: LsmRepository) {}

  async getStudentTaskFileContent(
    studentId: string,
    classCode: string,
    taskCode: string
  ): Promise<LsmStudentTaskFileResponse> {
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
        file: toContentFileInfo(fileRow)
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
  ): LsmStudentTaskFileResponse {
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