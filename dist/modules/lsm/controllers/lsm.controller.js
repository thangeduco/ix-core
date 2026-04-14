"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LsmController = void 0;
const response_1 = require("../../../shared/utils/response");
const lsm_service_1 = require("../services/lsm.service");
const lsm_dto_1 = require("../dtos/lsm.dto");
const service = new lsm_service_1.LsmService();
class LsmController {
    async getStudentCoursesWithPendingWeeks(req, res, next) {
        try {
            const { studentId } = lsm_dto_1.studentIdParamsDto.parse(req.params);
            const result = await service.getStudentCoursesWithPendingWeeks(studentId);
            res.json((0, response_1.ok)(result));
        }
        catch (error) {
            next(error);
        }
    }
    async getRecentStudentEvents(req, res, next) {
        try {
            const { studentId } = lsm_dto_1.studentIdParamsDto.parse(req.params);
            const { limit } = lsm_dto_1.recentQueryDto.parse(req.query);
            const result = await service.getRecentStudentEvents(studentId, limit);
            res.json((0, response_1.ok)(result));
        }
        catch (error) {
            next(error);
        }
    }
    async getRecentClassEvents(req, res, next) {
        try {
            const { classId } = lsm_dto_1.classIdParamsDto.parse(req.params);
            const { limit } = lsm_dto_1.recentQueryDto.parse(req.query);
            const result = await service.getRecentClassEvents(classId, limit);
            res.json((0, response_1.ok)(result));
        }
        catch (error) {
            next(error);
        }
    }
    async getStudentWeeklyTasks(req, res, next) {
        try {
            const { studentId, classCode, weekNo } = lsm_dto_1.studentClassWeekParamsDto.parse(req.params);
            const result = await service.getStudentWeeklyTasks(studentId, classCode, weekNo);
            res.json((0, response_1.ok)(result));
        }
        catch (error) {
            next(error);
        }
    }
    async getWeekProgress(req, res, next) {
        try {
            const { studentId, classCode, weekNo } = lsm_dto_1.studentClassWeekParamsDto.parse(req.params);
            const result = await service.getWeekProgress(studentId, classCode, weekNo);
            res.json((0, response_1.ok)(result));
        }
        catch (error) {
            next(error);
        }
    }
    async getPreviousWeekResult(req, res, next) {
        try {
            const { studentId, classCode } = lsm_dto_1.studentClassParamsDto.parse(req.params);
            const result = await service.getPreviousWeekResult(studentId, classCode);
            res.json((0, response_1.ok)(result));
        }
        catch (error) {
            next(error);
        }
    }
    async getPreviousWeekResultByWeekNo(req, res, next) {
        try {
            const { studentId, classCode, weekNo } = lsm_dto_1.studentClassWeekParamsDto.parse(req.params);
            const result = await service.getPreviousWeekResultByWeekNo(studentId, classCode, weekNo);
            res.json((0, response_1.ok)(result));
        }
        catch (error) {
            next(error);
        }
    }
    async getDashboard(req, res, next) {
        try {
            const { studentId, classCode } = lsm_dto_1.studentClassParamsDto.parse(req.params);
            const result = await service.getDashboard(studentId, classCode);
            res.json((0, response_1.ok)(result));
        }
        catch (error) {
            next(error);
        }
    }
    async getDashboardByWeekNo(req, res, next) {
        try {
            const { studentId, classCode, weekNo } = lsm_dto_1.studentClassWeekParamsDto.parse(req.params);
            const result = await service.getDashboardByWeekNo(studentId, classCode, weekNo);
            res.json((0, response_1.ok)(result));
        }
        catch (error) {
            next(error);
        }
    }
    async getStudentTaskContent(req, res, next) {
        try {
            const { studentId, classCode, taskCode } = lsm_dto_1.studentTaskContentParamsDto.parse(req.params);
            const result = await service.getStudentTaskContent(studentId, classCode, taskCode);
            res.json((0, response_1.ok)(result));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LsmController = LsmController;
