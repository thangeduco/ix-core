"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PseController = void 0;
const response_1 = require("../../../shared/utils/response");
const pse_service_1 = require("../services/pse.service");
const pse_dto_1 = require("../dtos/pse.dto");
const service = new pse_service_1.PseService();
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
class PseController {
    async getWeeklyTasks(req, res, next) {
        try {
            const query = pse_dto_1.weeklyTaskQueryDto.parse(req.query);
            const result = await service.getWeeklyTasks(query.student_user_id, query.week_id);
            res.json((0, response_1.ok)(result, "Get weekly tasks success"));
        }
        catch (e) {
            next(e);
        }
    }
    async getWeeklySummary(req, res, next) {
        try {
            const query = pse_dto_1.weeklyTaskQueryDto.parse(req.query);
            const result = await service.getWeeklySummary(query.student_user_id, query.week_id);
            res.json((0, response_1.ok)(result, "Get weekly summary success"));
        }
        catch (e) {
            next(e);
        }
    }
    async getStudentRanking(req, res, next) {
        try {
            const studentId = getParam(req.params.studentId, "studentId");
            const result = await service.getStudentRanking(studentId);
            res.json((0, response_1.ok)(result, "Get student ranking success"));
        }
        catch (e) {
            next(e);
        }
    }
    async getStudentGroups(req, res, next) {
        try {
            const studentId = getParam(req.params.studentId, "studentId");
            const result = await service.getStudentGroups(studentId);
            res.json((0, response_1.ok)(result, "Get student groups success"));
        }
        catch (e) {
            next(e);
        }
    }
    async createParentTask(req, res, next) {
        try {
            const payload = pse_dto_1.createParentTaskDto.parse(req.body);
            const result = await service.createParentTask(payload);
            res.status(201).json((0, response_1.ok)(result, "Create parent task success"));
        }
        catch (e) {
            next(e);
        }
    }
    async updateParentTask(req, res, next) {
        try {
            const taskId = getParam(req.params.taskId, "taskId");
            const payload = pse_dto_1.parentTaskUpdateDto.parse(req.body);
            const result = await service.updateParentTask(taskId, payload.status);
            res.json((0, response_1.ok)(result, "Update parent task success"));
        }
        catch (e) {
            next(e);
        }
    }
    async getParentTasks(req, res, next) {
        try {
            const parentId = getParam(req.params.parentId, "parentId");
            const result = await service.getParentTasks(parentId);
            res.json((0, response_1.ok)(result, "Get parent tasks success"));
        }
        catch (e) {
            next(e);
        }
    }
}
exports.PseController = PseController;
