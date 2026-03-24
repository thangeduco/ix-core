"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CccController = void 0;
const response_1 = require("../../../shared/utils/response");
const ccc_service_1 = require("../services/ccc.service");
const ccc_dto_1 = require("../dtos/ccc.dto");
const cccService = new ccc_service_1.CccService();
const getParam = (value, name) => {
    if (Array.isArray(value)) {
        if (!value[0]) {
            throw new Error(`Missing route param: ${name}`);
        }
        return value[0];
    }
    if (!value) {
        throw new Error(`Missing route param: ${name}`);
    }
    return value;
};
class CccController {
    async listCourses(req, res, next) {
        try {
            const query = ccc_dto_1.courseListQueryDto.parse(req.query);
            const result = await cccService.listCourses(query);
            res.json((0, response_1.ok)(result, "List courses success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createCourse(req, res, next) {
        try {
            const payload = ccc_dto_1.createCourseDto.parse(req.body);
            const createdBy = String(req.headers["x-user-id"] || "mock-admin-id");
            const result = await cccService.createCourse({
                ...payload,
                created_by: createdBy
            });
            res.status(201).json((0, response_1.ok)(result, "Create course success"));
        }
        catch (error) {
            next(error);
        }
    }
    async getCourseDetail(req, res, next) {
        try {
            const courseId = getParam(req.params.courseId, "courseId");
            const result = await cccService.getCourseDetail(courseId);
            res.json((0, response_1.ok)(result, "Get course detail success"));
        }
        catch (error) {
            next(error);
        }
    }
    async updateCourse(req, res, next) {
        try {
            const courseId = getParam(req.params.courseId, "courseId");
            const payload = ccc_dto_1.updateCourseDto.parse(req.body);
            const result = await cccService.updateCourse(courseId, payload);
            res.json((0, response_1.ok)(result, "Update course success"));
        }
        catch (error) {
            next(error);
        }
    }
    async listCourseWeeks(req, res, next) {
        try {
            const courseId = getParam(req.params.courseId, "courseId");
            const result = await cccService.listCourseWeeks(courseId);
            res.json((0, response_1.ok)(result, "List course weeks success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createCourseWeek(req, res, next) {
        try {
            const courseId = getParam(req.params.courseId, "courseId");
            const payload = ccc_dto_1.createCourseWeekDto.parse(req.body);
            const result = await cccService.createCourseWeek(courseId, payload);
            res.status(201).json((0, response_1.ok)(result, "Create course week success"));
        }
        catch (error) {
            next(error);
        }
    }
    async getWeekDetail(req, res, next) {
        try {
            const weekId = getParam(req.params.weekId, "weekId");
            const result = await cccService.getWeekDetail(weekId);
            res.json((0, response_1.ok)(result, "Get week detail success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createLesson(req, res, next) {
        try {
            const weekId = getParam(req.params.weekId, "weekId");
            const payload = ccc_dto_1.createLessonDto.parse(req.body);
            const result = await cccService.createLesson(weekId, payload);
            res.status(201).json((0, response_1.ok)(result, "Create lesson success"));
        }
        catch (error) {
            next(error);
        }
    }
    async getLessonDetail(req, res, next) {
        try {
            const lessonId = getParam(req.params.lessonId, "lessonId");
            const result = await cccService.getLessonDetail(lessonId);
            res.json((0, response_1.ok)(result, "Get lesson detail success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createQuiz(req, res, next) {
        try {
            const weekId = getParam(req.params.weekId, "weekId");
            const payload = ccc_dto_1.createQuizDto.parse(req.body);
            const result = await cccService.createQuiz(weekId, payload);
            res.status(201).json((0, response_1.ok)(result, "Create quiz success"));
        }
        catch (error) {
            next(error);
        }
    }
    async getQuizDetail(req, res, next) {
        try {
            const quizId = getParam(req.params.quizId, "quizId");
            const result = await cccService.getQuizDetail(quizId);
            res.json((0, response_1.ok)(result, "Get quiz detail success"));
        }
        catch (error) {
            next(error);
        }
    }
    async listHomeworks(req, res, next) {
        try {
            const weekId = getParam(req.params.weekId, "weekId");
            const result = await cccService.listHomeworks(weekId);
            res.json((0, response_1.ok)(result, "List homeworks success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createHomework(req, res, next) {
        try {
            const weekId = getParam(req.params.weekId, "weekId");
            const payload = ccc_dto_1.createHomeworkDto.parse(req.body);
            const result = await cccService.createHomework(weekId, payload);
            res.status(201).json((0, response_1.ok)(result, "Create homework success"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CccController = CccController;
