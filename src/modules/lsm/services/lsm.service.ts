import { LsmRepository } from "../repositories/lsm.repository";
import { LsmProgressService } from "./lsm-progress.service";
import { LsmStudentOverviewService } from "./lsm-student-overview.service";
import { LsmVideoLectureService } from "./lsm-video-lecture.service";
import { LsmFileContentService } from "./lsm-file-content.service";
import { LsmQuizTestService } from "./lsm-quiz-test.service";
import { LsmStudentTaskContentResponse } from "../types/lsm.types";

export class LsmService {
  private readonly repo = new LsmRepository();
  private readonly overviewService = new LsmStudentOverviewService(this.repo);
  private readonly progressService = new LsmProgressService(
    this.repo,
    this.getTaskStatus.bind(this),
    this.getPreviousWeekNo.bind(this)
  );
  private readonly videoLectureService = new LsmVideoLectureService(this.repo);
  private readonly fileContentService = new LsmFileContentService(this.repo);
  private readonly quizTestService = new LsmQuizTestService(this.repo);

  async getStudentCoursesWithPendingWeeks(studentId: string) {
    return this.overviewService.getStudentCoursesWithPendingWeeks(studentId);
  }

  async getRecentStudentEvents(studentId: string, limit = 10) {
    return this.overviewService.getRecentStudentEvents(studentId, limit);
  }

  async getRecentClassEvents(classId: string, limit = 10) {
    return this.overviewService.getRecentClassEvents(classId, limit);
  }

  getPreviousWeekNo(currentWeekNo: number | null): number | null {
    if (currentWeekNo === null || currentWeekNo === undefined) {
      return null;
    }

    return currentWeekNo > 1 ? currentWeekNo - 1 : null;
  }

  getTaskStatus(assignStatus?: string | null): string {
    if (assignStatus === "assigned" || assignStatus === "redo_required") {
      return "NEED_STUDENT_DO";
    }

    if (assignStatus === "in_progress") {
      return "NEED_STUDENT_CONTINUE";
    }

    if (
      assignStatus === "submitted_for_review" ||
      assignStatus === "done" ||
      assignStatus === "reviewed_ok"
    ) {
      return "STUDENT_DONE";
    }

    return "NO_NEED_STUDENT_DO";
  }

  async getStudentWeeklyTasks(studentId: string, classCode: string, weekNo: number) {
    return this.progressService.getStudentWeeklyTasks(studentId, classCode, weekNo);
  }

  async getWeekProgress(studentId: string, classCode: string, weekNo: number) {
    return this.progressService.getWeekProgress(studentId, classCode, weekNo);
  }

  async getPreviousWeekResult(studentId: string, classCode: string) {
    return this.progressService.getPreviousWeekResult(studentId, classCode);
  }

  async getPreviousWeekResultByWeekNo(
    studentId: string,
    classCode: string,
    weekNo: number
  ) {
    return this.progressService.getPreviousWeekResultByWeekNo(
      studentId,
      classCode,
      weekNo
    );
  }

  async getDashboard(studentId: string, classCode: string) {
    return this.progressService.getDashboard(studentId, classCode);
  }

  async getDashboardByWeekNo(studentId: string, classCode: string, weekNo: number) {
    return this.progressService.getDashboardByWeekNo(studentId, classCode, weekNo);
  }

  async getStudentTaskVideoLecture(
    studentId: string,
    classCode: string,
    taskCode: string
  ) {
    return this.videoLectureService.getStudentTaskVideoLecture(
      studentId,
      classCode,
      taskCode
    );
  }

  async getStudentTaskFileContent(
    studentId: string,
    classCode: string,
    taskCode: string
  ) {
    return this.fileContentService.getStudentTaskFileContent(
      studentId,
      classCode,
      taskCode
    );
  }

  async getStudentTaskQuizeTest(
    studentId: string,
    classCode: string,
    taskCode: string
  ) {
    return this.quizTestService.getStudentTaskQuizeTest(
      studentId,
      classCode,
      taskCode
    );
  }

  async getStudentTaskContent(
    studentId: string,
    classCode: string,
    taskCode: string
  ): Promise<LsmStudentTaskContentResponse> {
    const [classInfoRow, taskStatisticsRow, taskRow] = await Promise.all([
      this.repo.findClassCourseInfoByClassCode(classCode),
      this.repo.findTaskStatisticsByTaskCode(studentId, classCode, taskCode),
      this.repo.findStudentTaskByTaskCode(studentId, classCode, taskCode)
    ]);

    const contentType = taskRow?.content_type ?? null;

    if (contentType === "VIDEO") {
      return this.videoLectureService.getStudentTaskVideoLecture(
        studentId,
        classCode,
        taskCode
      );
    }

    if (contentType === "FILE") {
      return this.fileContentService.getStudentTaskFileContent(
        studentId,
        classCode,
        taskCode
      );
    }

    if (contentType === "QUIZ_TEST") {
      return this.quizTestService.getStudentTaskQuizeTest(
        studentId,
        classCode,
        taskCode
      );
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
        class_id:
          taskStatisticsRow?.class_id !== null &&
          taskStatisticsRow?.class_id !== undefined
            ? String(taskStatisticsRow.class_id)
            : null,
        class_week_id:
          taskStatisticsRow?.class_week_id !== null &&
          taskStatisticsRow?.class_week_id !== undefined
            ? String(taskStatisticsRow.class_week_id)
            : null,
        total_student_assigned: Number(taskStatisticsRow?.total_student_assigned || 0),
        total_student_completed: Number(taskStatisticsRow?.total_student_completed || 0),
        highest_score:
          taskStatisticsRow?.highest_score !== null &&
          taskStatisticsRow?.highest_score !== undefined
            ? Number(taskStatisticsRow.highest_score)
            : null
      },
      file_content: null
    };
  }
}