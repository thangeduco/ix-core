"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CgeController = void 0;
const response_1 = require("../../../shared/utils/response");
const cge_service_1 = require("../services/cge.service");
const cge_dto_1 = require("../dtos/cge.dto");
const cgeService = new cge_service_1.CgeService();
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
class CgeController {
    async listClasses(req, res, next) {
        try {
            const courseId = typeof req.query.course_id === "string" ? req.query.course_id : undefined;
            const result = await cgeService.listClasses(courseId);
            res.json((0, response_1.ok)(result, "List classes success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createClass(req, res, next) {
        try {
            const payload = cge_dto_1.createClassDto.parse(req.body);
            const result = await cgeService.createClass(payload);
            res.status(201).json((0, response_1.ok)(result, "Create class success"));
        }
        catch (error) {
            next(error);
        }
    }
    async assignTeacherToClass(req, res, next) {
        try {
            const classId = getParam(req.params.classId, "classId");
            const payload = cge_dto_1.assignTeacherToClassDto.parse(req.body);
            const result = await cgeService.assignTeacherToClass(classId, payload);
            res.status(201).json((0, response_1.ok)(result, "Assign teacher success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createEnrollment(req, res, next) {
        try {
            const payload = cge_dto_1.createEnrollmentDto.parse(req.body);
            const result = await cgeService.createEnrollment(payload);
            res.status(201).json((0, response_1.ok)(result, "Create enrollment success"));
        }
        catch (error) {
            next(error);
        }
    }
    async listEnrollments(req, res, next) {
        try {
            const query = cge_dto_1.enrollmentListQueryDto.parse(req.query);
            const result = await cgeService.listEnrollments(query);
            res.json((0, response_1.ok)(result, "List enrollments success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createGroup(req, res, next) {
        try {
            const payload = cge_dto_1.createGroupDto.parse(req.body);
            const ownerUserId = String(req.headers["x-user-id"] || "mock-user-id");
            const result = await cgeService.createGroup({
                ...payload,
                owner_user_id: ownerUserId
            });
            res.status(201).json((0, response_1.ok)(result, "Create group success"));
        }
        catch (error) {
            next(error);
        }
    }
    async listGroups(req, res, next) {
        try {
            const query = cge_dto_1.groupListQueryDto.parse(req.query);
            const result = await cgeService.listGroups(query);
            res.json((0, response_1.ok)(result, "List groups success"));
        }
        catch (error) {
            next(error);
        }
    }
    async getGroupDetail(req, res, next) {
        try {
            const groupId = getParam(req.params.groupId, "groupId");
            const result = await cgeService.getGroupDetail(groupId);
            res.json((0, response_1.ok)(result, "Get group detail success"));
        }
        catch (error) {
            next(error);
        }
    }
    async updateGroup(req, res, next) {
        try {
            const groupId = getParam(req.params.groupId, "groupId");
            const payload = cge_dto_1.updateGroupDto.parse(req.body);
            const result = await cgeService.updateGroup(groupId, payload);
            res.json((0, response_1.ok)(result, "Update group success"));
        }
        catch (error) {
            next(error);
        }
    }
    async inviteMembers(req, res, next) {
        try {
            const groupId = getParam(req.params.groupId, "groupId");
            const payload = cge_dto_1.inviteMembersDto.parse(req.body);
            const result = await cgeService.inviteMembers(groupId, payload);
            res.status(201).json((0, response_1.ok)(result, "Invite members success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createJoinRequest(req, res, next) {
        try {
            const groupId = getParam(req.params.groupId, "groupId");
            cge_dto_1.createJoinRequestDto.parse(req.body);
            const requesterUserId = String(req.headers["x-user-id"] || "mock-user-id");
            const result = await cgeService.createJoinRequest(groupId, requesterUserId);
            res.status(201).json((0, response_1.ok)(result, "Create join request success"));
        }
        catch (error) {
            next(error);
        }
    }
    async approveJoinRequest(req, res, next) {
        try {
            const groupId = getParam(req.params.groupId, "groupId");
            const requestId = getParam(req.params.requestId, "requestId");
            const payload = cge_dto_1.approveJoinRequestDto.parse(req.body);
            const reviewedBy = String(req.headers["x-user-id"] || "mock-user-id");
            const result = await cgeService.approveJoinRequest(groupId, requestId, reviewedBy, payload.member_role);
            res.json((0, response_1.ok)(result, "Approve join request success"));
        }
        catch (error) {
            next(error);
        }
    }
    async rejectJoinRequest(req, res, next) {
        try {
            const groupId = getParam(req.params.groupId, "groupId");
            const requestId = getParam(req.params.requestId, "requestId");
            const reviewedBy = String(req.headers["x-user-id"] || "mock-user-id");
            const result = await cgeService.rejectJoinRequest(groupId, requestId, reviewedBy);
            res.json((0, response_1.ok)(result, "Reject join request success"));
        }
        catch (error) {
            next(error);
        }
    }
    async removeGroupMember(req, res, next) {
        try {
            const groupId = getParam(req.params.groupId, "groupId");
            const userId = getParam(req.params.userId, "userId");
            const result = await cgeService.removeGroupMember(groupId, userId);
            res.json((0, response_1.ok)(result, "Remove group member success"));
        }
        catch (error) {
            next(error);
        }
    }
    async leaveGroup(req, res, next) {
        try {
            const groupId = getParam(req.params.groupId, "groupId");
            const userId = String(req.headers["x-user-id"] || "mock-user-id");
            const result = await cgeService.leaveGroup(groupId, userId);
            res.json((0, response_1.ok)(result, "Leave group success"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CgeController = CgeController;
