import { CgeRepository } from "../repositories/cge.repository";

export class CgeService {
  private readonly cgeRepository = new CgeRepository();

  async listClasses(courseId?: string) {
    return this.cgeRepository.listClasses(courseId);
  }

  async createClass(payload: {
    course_id: string;
    name: string;
    description?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }) {
    return this.cgeRepository.createClass(payload);
  }

  async assignTeacherToClass(classId: string, payload: {
    teacher_user_id: string;
    role_in_class: string;
  }) {
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

  async createEnrollment(payload: {
    course_id: string;
    class_id?: string;
    student_user_id: string;
    enrollment_status?: "active" | "inactive" | "pending" | "cancelled";
  }) {
    return this.cgeRepository.createEnrollment(payload);
  }

  async listEnrollments(query: {
    course_id?: string;
    class_id?: string;
    student_user_id?: string;
    enrollment_status?: string;
    page?: string;
    limit?: string;
  }) {
    return this.cgeRepository.listEnrollments({
      course_id: query.course_id,
      class_id: query.class_id,
      student_user_id: query.student_user_id,
      enrollment_status: query.enrollment_status,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20
    });
  }

  async createGroup(payload: {
    name: string;
    description?: string;
    owner_user_id: string;
    owner_type: "student" | "teacher" | "parent";
    visibility?: "private" | "invite_only" | "public";
    avatar_file_id?: string;
    status?: "active" | "inactive" | "archived";
  }) {
    const group = await this.cgeRepository.createGroup(payload);

    await this.cgeRepository.addGroupOwnerAsMember({
      group_id: group.id,
      user_id: payload.owner_user_id
    });

    return group;
  }

  async listGroups(query: {
    owner_user_id?: string;
    member_user_id?: string;
    owner_type?: "student" | "teacher" | "parent";
    keyword?: string;
    page?: string;
    limit?: string;
  }) {
    return this.cgeRepository.listGroups({
      owner_user_id: query.owner_user_id,
      member_user_id: query.member_user_id,
      owner_type: query.owner_type,
      keyword: query.keyword,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20
    });
  }

  async getGroupDetail(groupId: string) {
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

  async updateGroup(groupId: string, payload: Record<string, unknown>) {
    const group = await this.cgeRepository.updateGroup(groupId, payload);

    if (!group) {
      throw new Error("Group not found");
    }

    return group;
  }

  async inviteMembers(groupId: string, payload: { user_ids: string[] }) {
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

  async createJoinRequest(groupId: string, requesterUserId: string) {
    const group = await this.cgeRepository.findGroupById(groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    return this.cgeRepository.createJoinRequest({
      group_id: groupId,
      requester_user_id: requesterUserId
    });
  }

  async approveJoinRequest(groupId: string, requestId: string, reviewedBy: string, memberRole?: string) {
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

  async rejectJoinRequest(groupId: string, requestId: string, reviewedBy: string) {
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

  async removeGroupMember(groupId: string, userId: string) {
    const removed = await this.cgeRepository.removeGroupMember(groupId, userId);

    if (!removed) {
      throw new Error("Group member not found");
    }

    return removed;
  }

  async leaveGroup(groupId: string, userId: string) {
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
