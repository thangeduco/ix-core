"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TewController = void 0;
const response_1 = require("../../../shared/utils/response");
const tew_service_1 = require("../services/tew.service");
const tew_dto_1 = require("../dtos/tew.dto");
const tewService = new tew_service_1.TewService();
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
class TewController {
    async getReviewWorkspace(req, res, next) {
        try {
            const studentId = getParam(req.params.studentId, "studentId");
            const weekId = getParam(req.params.weekId, "weekId");
            const result = await tewService.getReviewWorkspace(studentId, weekId);
            res.json((0, response_1.ok)(result, "Get review workspace success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createWeeklyReview(req, res, next) {
        try {
            const payload = tew_dto_1.createWeeklyReviewDto.parse(req.body);
            const teacherUserId = String(req.headers["x-user-id"] || "mock-teacher-id");
            const result = await tewService.createWeeklyReview({
                ...payload,
                teacher_user_id: teacherUserId
            });
            res.status(201).json((0, response_1.ok)(result, "Create weekly review success"));
        }
        catch (error) {
            next(error);
        }
    }
    async updateWeeklyReview(req, res, next) {
        try {
            const reviewId = getParam(req.params.reviewId, "reviewId");
            const payload = tew_dto_1.updateWeeklyReviewDto.parse(req.body);
            const result = await tewService.updateWeeklyReview(reviewId, payload);
            res.json((0, response_1.ok)(result, "Update weekly review success"));
        }
        catch (error) {
            next(error);
        }
    }
    async getWeeklyReviewDetail(req, res, next) {
        try {
            const reviewId = getParam(req.params.reviewId, "reviewId");
            const result = await tewService.getWeeklyReviewDetail(reviewId);
            res.json((0, response_1.ok)(result, "Get weekly review detail success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createTeacherAssignedTask(req, res, next) {
        try {
            const payload = tew_dto_1.createTeacherAssignedTaskDto.parse(req.body);
            const result = await tewService.createTeacherAssignedTask(payload);
            res.status(201).json((0, response_1.ok)(result, "Create teacher assigned task success"));
        }
        catch (error) {
            next(error);
        }
    }
    async listTeacherAssignedTasks(req, res, next) {
        try {
            const query = tew_dto_1.teacherAssignedTaskListQueryDto.parse(req.query);
            const result = await tewService.listTeacherAssignedTasks(query);
            res.json((0, response_1.ok)(result, "List teacher assigned tasks success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createStudentHomeworkOverride(req, res, next) {
        try {
            const payload = tew_dto_1.createStudentHomeworkOverrideDto.parse(req.body);
            const teacherUserId = String(req.headers["x-user-id"] || "mock-teacher-id");
            const result = await tewService.createStudentHomeworkOverride({
                ...payload,
                created_by: teacherUserId
            });
            res.status(201).json((0, response_1.ok)(result, "Create student homework override success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createOfflineActivityRecord(req, res, next) {
        try {
            const payload = tew_dto_1.createOfflineActivityRecordDto.parse(req.body);
            const teacherUserId = String(req.headers["x-user-id"] || "mock-teacher-id");
            const result = await tewService.createOfflineActivityRecord({
                ...payload,
                recorded_by: teacherUserId
            });
            res.status(201).json((0, response_1.ok)(result, "Create offline activity record success"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TewController = TewController;
