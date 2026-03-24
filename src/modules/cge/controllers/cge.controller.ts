import { Request, Response, NextFunction } from "express";
import { ok } from "../../../shared/utils/response";
import { CgeService } from "../services/cge.service";
import {
  approveJoinRequestDto,
  assignTeacherToClassDto,
  createClassDto,
  createEnrollmentDto,
  createGroupDto,
  createJoinRequestDto,
  enrollmentListQueryDto,
  groupListQueryDto,
  inviteMembersDto,
  updateGroupDto
} from "../dtos/cge.dto";

const cgeService = new CgeService();

const getParam = (value: string | string[] | undefined, name: string): string => {
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

export class CgeController {
  async listClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId =
        typeof req.query.course_id === "string" ? req.query.course_id : undefined;

      const result = await cgeService.listClasses(courseId);
      res.json(ok(result, "List classes success"));
    } catch (error) {
      next(error);
    }
  }

  async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createClassDto.parse(req.body);
      const result = await cgeService.createClass(payload);
      res.status(201).json(ok(result, "Create class success"));
    } catch (error) {
      next(error);
    }
  }

  async assignTeacherToClass(req: Request, res: Response, next: NextFunction) {
    try {
      const classId = getParam(req.params.classId, "classId");
      const payload = assignTeacherToClassDto.parse(req.body);
      const result = await cgeService.assignTeacherToClass(classId, payload);
      res.status(201).json(ok(result, "Assign teacher success"));
    } catch (error) {
      next(error);
    }
  }

  async createEnrollment(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createEnrollmentDto.parse(req.body);
      const result = await cgeService.createEnrollment(payload);
      res.status(201).json(ok(result, "Create enrollment success"));
    } catch (error) {
      next(error);
    }
  }

  async listEnrollments(req: Request, res: Response, next: NextFunction) {
    try {
      const query = enrollmentListQueryDto.parse(req.query);
      const result = await cgeService.listEnrollments(query);
      res.json(ok(result, "List enrollments success"));
    } catch (error) {
      next(error);
    }
  }

  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createGroupDto.parse(req.body);
      const ownerUserId = String(req.headers["x-user-id"] || "mock-user-id");

      const result = await cgeService.createGroup({
        ...payload,
        owner_user_id: ownerUserId
      });

      res.status(201).json(ok(result, "Create group success"));
    } catch (error) {
      next(error);
    }
  }

  async listGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const query = groupListQueryDto.parse(req.query);
      const result = await cgeService.listGroups(query);
      res.json(ok(result, "List groups success"));
    } catch (error) {
      next(error);
    }
  }

  async getGroupDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = getParam(req.params.groupId, "groupId");
      const result = await cgeService.getGroupDetail(groupId);
      res.json(ok(result, "Get group detail success"));
    } catch (error) {
      next(error);
    }
  }

  async updateGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = getParam(req.params.groupId, "groupId");
      const payload = updateGroupDto.parse(req.body);
      const result = await cgeService.updateGroup(groupId, payload);
      res.json(ok(result, "Update group success"));
    } catch (error) {
      next(error);
    }
  }

  async inviteMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = getParam(req.params.groupId, "groupId");
      const payload = inviteMembersDto.parse(req.body);
      const result = await cgeService.inviteMembers(groupId, payload);
      res.status(201).json(ok(result, "Invite members success"));
    } catch (error) {
      next(error);
    }
  }

  async createJoinRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = getParam(req.params.groupId, "groupId");
      createJoinRequestDto.parse(req.body);
      const requesterUserId = String(req.headers["x-user-id"] || "mock-user-id");
      const result = await cgeService.createJoinRequest(groupId, requesterUserId);
      res.status(201).json(ok(result, "Create join request success"));
    } catch (error) {
      next(error);
    }
  }

  async approveJoinRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = getParam(req.params.groupId, "groupId");
      const requestId = getParam(req.params.requestId, "requestId");
      const payload = approveJoinRequestDto.parse(req.body);
      const reviewedBy = String(req.headers["x-user-id"] || "mock-user-id");

      const result = await cgeService.approveJoinRequest(
        groupId,
        requestId,
        reviewedBy,
        payload.member_role
      );

      res.json(ok(result, "Approve join request success"));
    } catch (error) {
      next(error);
    }
  }

  async rejectJoinRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = getParam(req.params.groupId, "groupId");
      const requestId = getParam(req.params.requestId, "requestId");
      const reviewedBy = String(req.headers["x-user-id"] || "mock-user-id");

      const result = await cgeService.rejectJoinRequest(
        groupId,
        requestId,
        reviewedBy
      );

      res.json(ok(result, "Reject join request success"));
    } catch (error) {
      next(error);
    }
  }

  async removeGroupMember(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = getParam(req.params.groupId, "groupId");
      const userId = getParam(req.params.userId, "userId");
      const result = await cgeService.removeGroupMember(groupId, userId);
      res.json(ok(result, "Remove group member success"));
    } catch (error) {
      next(error);
    }
  }

  async leaveGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = getParam(req.params.groupId, "groupId");
      const userId = String(req.headers["x-user-id"] || "mock-user-id");
      const result = await cgeService.leaveGroup(groupId, userId);
      res.json(ok(result, "Leave group success"));
    } catch (error) {
      next(error);
    }
  }
}