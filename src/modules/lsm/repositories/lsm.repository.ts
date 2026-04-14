import { LsmCourseRepository } from "./lsm-course.repository";
import { LsmEventRepository } from "./lsm-event.repository";
import { LsmVideoRepository } from "./lsm-video.repository";
import { LsmWeekRepository } from "./lsm-week.repository";

export class LsmRepository {
  private readonly courseRepo = new LsmCourseRepository();
  private readonly eventRepo = new LsmEventRepository();
  private readonly weekRepo = new LsmWeekRepository();
  private readonly videoRepo = new LsmVideoRepository();

  findStudentCourseInfos(studentId: string) {
    return this.courseRepo.findStudentCourseInfos(studentId);
  }

  findStudentPendingWeeks(studentId: string) {
    return this.courseRepo.findStudentPendingWeeks(studentId);
  }

  findClassCourseInfoByClassCode(classCode: string) {
    return this.courseRepo.findClassCourseInfoByClassCode(classCode);
  }

  findRecentStudentEvents(studentId: string, limit: number) {
    return this.eventRepo.findRecentStudentEvents(studentId, limit);
  }

  findRecentClassEvents(classId: string, limit: number) {
    return this.eventRepo.findRecentClassEvents(classId, limit);
  }

  findCurrentClassWeekNo(classCode: string) {
    return this.weekRepo.findCurrentClassWeekNo(classCode);
  }

  findClassWeekByWeekNo(classCode: string, weekNo: number) {
    return this.weekRepo.findClassWeekByWeekNo(classCode, weekNo);
  }

  findStudentWeeklyTasks(studentId: string, classCode: string, weekNo: number) {
    return this.weekRepo.findStudentWeeklyTasks(studentId, classCode, weekNo);
  }

  findWeekProgressSummary(studentId: string, classCode: string, weekNo: number) {
    return this.weekRepo.findWeekProgressSummary(studentId, classCode, weekNo);
  }

  findStudentClassWeekResultByWeekNo(
    studentId: string,
    classCode: string,
    weekNo: number
  ) {
    return this.weekRepo.findStudentClassWeekResultByWeekNo(
      studentId,
      classCode,
      weekNo
    );
  }

  findStudentWeekRankings(studentId: string, classCode: string, weekNo: number) {
    return this.weekRepo.findStudentWeekRankings(studentId, classCode, weekNo);
  }

  findStudentTaskByTaskCode(studentId: string, classCode: string, taskCode: string) {
    return this.videoRepo.findStudentTaskByTaskCode(studentId, classCode, taskCode);
  }

  findTaskStatisticsByTaskCode(studentId: string, classCode: string, taskCode: string) {
    return this.weekRepo.findTaskStatisticsByTaskCode(studentId, classCode, taskCode);
  }

  findClassWeekContentItemById(sourceId: string) {
    return this.videoRepo.findClassWeekContentItemById(sourceId);
  }

  findStudentClassWeekContentItemById(studentId: string, sourceId: string) {
    return this.videoRepo.findStudentClassWeekContentItemById(studentId, sourceId);
  }

  findLectureVideoById(contentId: string) {
    return this.videoRepo.findLectureVideoById(contentId);
  }

  findVideoQuizEventsByLectureVideoId(contentId: string) {
    return this.videoRepo.findVideoQuizEventsByLectureVideoId(contentId);
  }

  findVideoQuizEventQuestionsByEventIds(eventIds: string[]) {
    return this.videoRepo.findVideoQuizEventQuestionsByEventIds(eventIds);
  }

  findQuizQuestionsByIds(questionIds: string[]) {
    return this.videoRepo.findQuizQuestionsByIds(questionIds);
  }

  findContentFileById(contentId: string) {
    return this.videoRepo.findContentFileById(contentId);
  }

  findQuizTestById(quizTestId: string) {
    return this.videoRepo.findQuizTestById(quizTestId);
  }

  findQuizTestQuestionsByQuizTestId(quizTestId: string) {
    return this.videoRepo.findQuizTestQuestionsByQuizTestId(quizTestId);
  }
}