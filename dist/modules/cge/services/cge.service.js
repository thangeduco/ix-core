"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CgeService = void 0;
const cge_repository_1 = require("../repositories/cge.repository");
class CgeService {
    constructor() {
        this.cgeRepository = new cge_repository_1.CgeRepository();
    }
    async listClasses(courseId) {
        return this.cgeRepository.listClasses(courseId);
    }
    async createClass(payload) {
        return this.cgeRepository.createClass(payload);
    }
    async assignTeacherToClass(classId, payload) {
        const classEntity = await this.cgeRepository.findClassById(classId);
        if (!classEntity) {
            throw new Error("Class not found");
        }
        return this.cgeRepository.assignTeacherToClass({
            class_id: classId,
            teacher_user_id: payload.teacher_user_id,
            role_in_class: payload.role_in_class
        });
    }
    async createEnrollment(payload) {
        return this.cgeRepository.createEnrollment(payload);
    }
    async listEnrollments(query) {
        return this.cgeRepository.listEnrollments({
            course_id: query.course_id,
            class_id: query.class_id,
            student_user_id: query.student_user_id,
            enrollment_status: query.enrollment_status,
            page: query.page ? Number(query.page) : 1,
            limit: query.limit ? Number(query.limit) : 20
        });
    }
    async createGroup(payload) {
        const group = await this.cgeRepository.createGroup(payload);
        await this.cgeRepository.addGroupOwnerAsMember({
            group_id: group.id,
            user_id: payload.owner_user_id
        });
        return group;
    }
    async listGroups(query) {
        return this.cgeRepository.listGroups({
            owner_user_id: query.owner_user_id,
            member_user_id: query.member_user_id,
            owner_type: query.owner_type,
            keyword: query.keyword,
            page: query.page ? Number(query.page) : 1,
            limit: query.limit ? Number(query.limit) : 20
        });
    }
    async getGroupDetail(groupId) {
        const group = await this.cgeRepository.findGroupById(groupId);
        if (!group) {
            throw new Error("Group not found");
        }
        const members = await this.cgeRepository.listGroupMembers(groupId);
        return {
            ...group,
            members
        };
    }
    async updateGroup(groupId, payload) {
        const group = await this.cgeRepository.updateGroup(groupId, payload);
        if (!group) {
            throw new Error("Group not found");
        }
        return group;
    }
    async inviteMembers(groupId, payload) {
        const group = await this.cgeRepository.findGroupById(groupId);
        if (!group) {
            throw new Error("Group not found");
        }
        const results = [];
        for (const userId of payload.user_ids) {
            const member = await this.cgeRepository.addGroupMember({
                group_id: groupId,
                user_id: userId,
                member_role: "member"
            });
            results.push(member);
        }
        return results;
    }
    async createJoinRequest(groupId, requesterUserId) {
        const group = await this.cgeRepository.findGroupById(groupId);
        if (!group) {
            throw new Error("Group not found");
        }
        return this.cgeRepository.createJoinRequest({
            group_id: groupId,
            requester_user_id: requesterUserId
        });
    }
    async approveJoinRequest(groupId, requestId, reviewedBy, memberRole) {
        const group = await this.cgeRepository.findGroupById(groupId);
        if (!group) {
            throw new Error("Group not found");
        }
        const joinRequest = await this.cgeRepository.findJoinRequestById(requestId);
        if (!joinRequest) {
            throw new Error("Join request not found");
        }
        const approved = await this.cgeRepository.approveJoinRequest({
            request_id: requestId,
            reviewed_by: reviewedBy
        });
        await this.cgeRepository.addGroupMember({
            group_id: groupId,
            user_id: joinRequest.requester_user_id,
            member_role: memberRole || "member"
        });
        return approved;
    }
    async rejectJoinRequest(groupId, requestId, reviewedBy) {
        const group = await this.cgeRepository.findGroupById(groupId);
        if (!group) {
            throw new Error("Group not found");
        }
        const joinRequest = await this.cgeRepository.findJoinRequestById(requestId);
        if (!joinRequest) {
            throw new Error("Join request not found");
        }
        return this.cgeRepository.rejectJoinRequest({
            request_id: requestId,
            reviewed_by: reviewedBy
        });
    }
    async removeGroupMember(groupId, userId) {
        const removed = await this.cgeRepository.removeGroupMember(groupId, userId);
        if (!removed) {
            throw new Error("Group member not found");
        }
        return removed;
    }
    async leaveGroup(groupId, userId) {
        const removed = await this.cgeRepository.removeGroupMember(groupId, userId);
        if (!removed) {
            throw new Error("Group member not found");
        }
        return {
            group_id: groupId,
            user_id: userId,
            status: "left"
        };
    }
}
exports.CgeService = CgeService;
