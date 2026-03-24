"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CccService = void 0;
const ccc_repository_1 = require("../repositories/ccc.repository");
class CccService {
    constructor() {
        this.cccRepository = new ccc_repository_1.CccRepository();
    }
    async listCourses(query) {
        return this.cccRepository.listCourses({
            subject: query.subject,
            grade_level: query.grade_level,
            course_type: query.course_type,
            status: query.status,
            keyword: query.keyword,
            page: query.page ? Number(query.page) : 1,
            limit: query.limit ? Number(query.limit) : 20
        });
    }
    async createCourse(payload) {
        return this.cccRepository.createCourse(payload);
    }
    async getCourseDetail(courseId) {
        const course = await this.cccRepository.findCourseById(courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        const weeks = await this.cccRepository.listCourseWeeks(courseId);
        return {
            ...course,
            weeks
        };
    }
    async updateCourse(courseId, payload) {
        const updated = await this.cccRepository.updateCourse(courseId, payload);
        if (!updated) {
            throw new Error("Course not found");
        }
        return updated;
    }
    async listCourseWeeks(courseId) {
        return this.cccRepository.listCourseWeeks(courseId);
    }
    async createCourseWeek(courseId, payload) {
        const course = await this.cccRepository.findCourseById(courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        return this.cccRepository.createCourseWeek(courseId, payload);
    }
    async getWeekDetail(weekId) {
        const overview = await this.cccRepository.listWeekOverview(weekId);
        if (!overview.week) {
            throw new Error("Course week not found");
        }
        return overview;
    }
    async createLesson(weekId, payload) {
        const week = await this.cccRepository.findCourseWeekById(weekId);
        if (!week) {
            throw new Error("Course week not found");
        }
        return this.cccRepository.createLesson(weekId, payload);
    }
    async getLessonDetail(lessonId) {
        const lesson = await this.cccRepository.findLessonById(lessonId);
        if (!lesson) {
            throw new Error("Lesson not found");
        }
        return lesson;
    }
    async createQuiz(weekId, payload) {
        const week = await this.cccRepository.findCourseWeekById(weekId);
        if (!week) {
            throw new Error("Course week not found");
        }
        return this.cccRepository.createQuiz(weekId, payload);
    }
    async getQuizDetail(quizId) {
        const quiz = await this.cccRepository.findQuizById(quizId);
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        return quiz;
    }
    async listHomeworks(weekId) {
        return this.cccRepository.listHomeworksByWeek(weekId);
    }
    async createHomework(weekId, payload) {
        const week = await this.cccRepository.findCourseWeekById(weekId);
        if (!week) {
            throw new Error("Course week not found");
        }
        return this.cccRepository.createHomework(weekId, payload);
    }
}
exports.CccService = CccService;
