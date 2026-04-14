"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LsmRepository = void 0;
const lsm_course_repository_1 = require("./lsm-course.repository");
const lsm_event_repository_1 = require("./lsm-event.repository");
const lsm_video_repository_1 = require("./lsm-video.repository");
const lsm_week_repository_1 = require("./lsm-week.repository");
class LsmRepository {
    constructor() {
        this.courseRepo = new lsm_course_repository_1.LsmCourseRepository();
        this.eventRepo = new lsm_event_repository_1.LsmEventRepository();
        this.weekRepo = new lsm_week_repository_1.LsmWeekRepository();
        this.videoRepo = new lsm_video_repository_1.LsmVideoRepository();
    }
    findStudentCourseInfos(studentId) {
        return this.courseRepo.findStudentCourseInfos(studentId);
    }
    findStudentPendingWeeks(studentId) {
        return this.courseRepo.findStudentPendingWeeks(studentId);
    }
    findClassCourseInfoByClassCode(classCode) {
        return this.courseRepo.findClassCourseInfoByClassCode(classCode);
    }
    findRecentStudentEvents(studentId, limit) {
        return this.eventRepo.findRecentStudentEvents(studentId, limit);
    }
    findRecentClassEvents(classId, limit) {
        return this.eventRepo.findRecentClassEvents(classId, limit);
    }
    findCurrentClassWeekNo(classCode) {
        return this.weekRepo.findCurrentClassWeekNo(classCode);
    }
    findClassWeekByWeekNo(classCode, weekNo) {
        return this.weekRepo.findClassWeekByWeekNo(classCode, weekNo);
    }
    findStudentWeeklyTasks(studentId, classCode, weekNo) {
        return this.weekRepo.findStudentWeeklyTasks(studentId, classCode, weekNo);
    }
    findWeekProgressSummary(studentId, classCode, weekNo) {
        return this.weekRepo.findWeekProgressSummary(studentId, classCode, weekNo);
    }
    findStudentClassWeekResultByWeekNo(studentId, classCode, weekNo) {
        return this.weekRepo.findStudentClassWeekResultByWeekNo(studentId, classCode, weekNo);
    }
    findStudentWeekRankings(studentId, classCode, weekNo) {
        return this.weekRepo.findStudentWeekRankings(studentId, classCode, weekNo);
    }
    findStudentTaskByTaskCode(studentId, classCode, taskCode) {
        return this.videoRepo.findStudentTaskByTaskCode(studentId, classCode, taskCode);
    }
    findTaskStatisticsByTaskCode(studentId, classCode, taskCode) {
        return this.weekRepo.findTaskStatisticsByTaskCode(studentId, classCode, taskCode);
    }
    findClassWeekContentItemById(sourceId) {
        return this.videoRepo.findClassWeekContentItemById(sourceId);
    }
    findStudentClassWeekContentItemById(studentId, sourceId) {
        return this.videoRepo.findStudentClassWeekContentItemById(studentId, sourceId);
    }
    findLectureVideoById(contentId) {
        return this.videoRepo.findLectureVideoById(contentId);
    }
    findVideoQuizEventsByLectureVideoId(contentId) {
        return this.videoRepo.findVideoQuizEventsByLectureVideoId(contentId);
    }
    findVideoQuizEventQuestionsByEventIds(eventIds) {
        return this.videoRepo.findVideoQuizEventQuestionsByEventIds(eventIds);
    }
    findQuizQuestionsByIds(questionIds) {
        return this.videoRepo.findQuizQuestionsByIds(questionIds);
    }
    findContentFileById(contentId) {
        return this.videoRepo.findContentFileById(contentId);
    }
    findQuizTestById(quizTestId) {
        return this.videoRepo.findQuizTestById(quizTestId);
    }
    findQuizTestQuestionsByQuizTestId(quizTestId) {
        return this.videoRepo.findQuizTestQuestionsByQuizTestId(quizTestId);
    }
}
exports.LsmRepository = LsmRepository;
