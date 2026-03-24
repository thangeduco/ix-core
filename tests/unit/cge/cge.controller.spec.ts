import { ok } from "../../../src/shared/utils/response";

const mockCgeService = {
  listClasses: jest.fn(),
  createClass: jest.fn(),
  assignTeacherToClass: jest.fn(),
  createEnrollment: jest.fn(),
  listEnrollments: jest.fn(),
  createGroup: jest.fn(),
  listGroups: jest.fn(),
  getGroupDetail: jest.fn(),
  updateGroup: jest.fn(),
  inviteMembers: jest.fn(),
  createJoinRequest: jest.fn(),
  approveJoinRequest: jest.fn(),
  rejectJoinRequest: jest.fn(),
  removeGroupMember: jest.fn(),
  leaveGroup: jest.fn()
};

jest.mock("../../../src/modules/cge/services/cge.service", () => {
  return {
    CgeService: jest.fn().mockImplementation(() => mockCgeService)
  };
});

import { CgeController } from "../../../src/modules/cge/controllers/cge.controller";

describe("CgeController unit test", () => {
  let controller: CgeController;

  const createMockRequest = (overrides = {}) =>
    ({
      body: {},
      params: {},
      query: {},
      headers: {},
      ...overrides
    } as any);

  const createMockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const createMockNext = () => jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CgeController();
  });

  describe("listClasses", () => {
    it("should list classes successfully", async () => {
      const req = createMockRequest({
        query: { course_id: "course-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "class-1" }];

      mockCgeService.listClasses.mockResolvedValue(result);

      await controller.listClasses(req, res, next);

      expect(mockCgeService.listClasses).toHaveBeenCalledWith("course-1");
      expect(res.json).toHaveBeenCalledWith(ok(result, "List classes success"));
      expect(next).not.toHaveBeenCalled();
    });

    it("should pass undefined when course_id is not string", async () => {
      const req = createMockRequest({
        query: {}
      });
      const res = createMockResponse();
      const next = createMockNext();

      mockCgeService.listClasses.mockResolvedValue([]);

      await controller.listClasses(req, res, next);

      expect(mockCgeService.listClasses).toHaveBeenCalledWith(undefined);
    });
  });

  describe("createClass", () => {
    it("should create class successfully", async () => {
      const req = createMockRequest({
        body: {
          course_id: "course-1",
          name: "Class A"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "class-1" };

      mockCgeService.createClass.mockResolvedValue(result);

      await controller.createClass(req, res, next);

      expect(mockCgeService.createClass).toHaveBeenCalledWith({
        course_id: "course-1",
        name: "Class A"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ok(result, "Create class success"));
    });

    it("should call next when dto invalid", async () => {
      const req = createMockRequest({
        body: {
          course_id: "",
          name: "A"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.createClass(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("assignTeacherToClass", () => {
    it("should assign teacher successfully", async () => {
      const req = createMockRequest({
        params: { classId: "class-1" },
        body: {
          teacher_user_id: "teacher-1",
          role_in_class: "main"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "assign-1" };

      mockCgeService.assignTeacherToClass.mockResolvedValue(result);

      await controller.assignTeacherToClass(req, res, next);

      expect(mockCgeService.assignTeacherToClass).toHaveBeenCalledWith("class-1", {
        teacher_user_id: "teacher-1",
        role_in_class: "main"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ok(result, "Assign teacher success"));
    });
  });

  describe("createEnrollment", () => {
    it("should create enrollment successfully", async () => {
      const req = createMockRequest({
        body: {
          course_id: "course-1",
          student_user_id: "student-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "enrollment-1" };

      mockCgeService.createEnrollment.mockResolvedValue(result);

      await controller.createEnrollment(req, res, next);

      expect(mockCgeService.createEnrollment).toHaveBeenCalledWith({
        course_id: "course-1",
        student_user_id: "student-1"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ok(result, "Create enrollment success"));
    });
  });

  describe("listEnrollments", () => {
    it("should list enrollments successfully", async () => {
      const req = createMockRequest({
        query: {
          course_id: "course-1",
          page: "1",
          limit: "10"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "enrollment-1" }];

      mockCgeService.listEnrollments.mockResolvedValue(result);

      await controller.listEnrollments(req, res, next);

      expect(mockCgeService.listEnrollments).toHaveBeenCalledWith({
        course_id: "course-1",
        page: "1",
        limit: "10"
      });
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "List enrollments success")
      );
    });
  });

  describe("createGroup", () => {
    it("should create group with x-user-id", async () => {
      const req = createMockRequest({
        headers: { "x-user-id": "user-1" },
        body: {
          name: "Group A",
          owner_type: "student"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "group-1" };

      mockCgeService.createGroup.mockResolvedValue(result);

      await controller.createGroup(req, res, next);

      expect(mockCgeService.createGroup).toHaveBeenCalledWith({
        name: "Group A",
        owner_type: "student",
        owner_user_id: "user-1"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ok(result, "Create group success"));
    });

    it("should fallback owner_user_id to mock-user-id", async () => {
      const req = createMockRequest({
        body: {
          name: "Group A",
          owner_type: "student"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      mockCgeService.createGroup.mockResolvedValue({ id: "group-1" });

      await controller.createGroup(req, res, next);

      expect(mockCgeService.createGroup).toHaveBeenCalledWith({
        name: "Group A",
        owner_type: "student",
        owner_user_id: "mock-user-id"
      });
    });
  });

  describe("listGroups", () => {
    it("should list groups successfully", async () => {
      const req = createMockRequest({
        query: {
          owner_type: "student",
          page: "1",
          limit: "10"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "group-1" }];

      mockCgeService.listGroups.mockResolvedValue(result);

      await controller.listGroups(req, res, next);

      expect(mockCgeService.listGroups).toHaveBeenCalledWith({
        owner_type: "student",
        page: "1",
        limit: "10"
      });
      expect(res.json).toHaveBeenCalledWith(ok(result, "List groups success"));
    });
  });

  describe("getGroupDetail", () => {
    it("should get group detail successfully", async () => {
      const req = createMockRequest({
        params: { groupId: "group-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "group-1", members: [] };

      mockCgeService.getGroupDetail.mockResolvedValue(result);

      await controller.getGroupDetail(req, res, next);

      expect(mockCgeService.getGroupDetail).toHaveBeenCalledWith("group-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get group detail success")
      );
    });
  });

  describe("updateGroup", () => {
    it("should update group successfully", async () => {
      const req = createMockRequest({
        params: { groupId: "group-1" },
        body: { name: "Group Updated" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "group-1", name: "Group Updated" };

      mockCgeService.updateGroup.mockResolvedValue(result);

      await controller.updateGroup(req, res, next);

      expect(mockCgeService.updateGroup).toHaveBeenCalledWith("group-1", {
        name: "Group Updated"
      });
      expect(res.json).toHaveBeenCalledWith(ok(result, "Update group success"));
    });
  });

  describe("inviteMembers", () => {
    it("should invite members successfully", async () => {
      const req = createMockRequest({
        params: { groupId: "group-1" },
        body: { user_ids: ["user-1", "user-2"] }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "member-1" }, { id: "member-2" }];

      mockCgeService.inviteMembers.mockResolvedValue(result);

      await controller.inviteMembers(req, res, next);

      expect(mockCgeService.inviteMembers).toHaveBeenCalledWith("group-1", {
        user_ids: ["user-1", "user-2"]
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ok(result, "Invite members success"));
    });
  });

  describe("createJoinRequest", () => {
    it("should create join request successfully", async () => {
      const req = createMockRequest({
        params: { groupId: "group-1" },
        headers: { "x-user-id": "user-1" },
        body: { message: "Xin tham gia" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "request-1" };

      mockCgeService.createJoinRequest.mockResolvedValue(result);

      await controller.createJoinRequest(req, res, next);

      expect(mockCgeService.createJoinRequest).toHaveBeenCalledWith(
        "group-1",
        "user-1"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Create join request success")
      );
    });
  });

  describe("approveJoinRequest", () => {
    it("should approve join request successfully", async () => {
      const req = createMockRequest({
        params: {
          groupId: "group-1",
          requestId: "request-1"
        },
        headers: {
          "x-user-id": "admin-1"
        },
        body: {
          member_role: "member"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "request-1", status: "approved" };

      mockCgeService.approveJoinRequest.mockResolvedValue(result);

      await controller.approveJoinRequest(req, res, next);

      expect(mockCgeService.approveJoinRequest).toHaveBeenCalledWith(
        "group-1",
        "request-1",
        "admin-1",
        "member"
      );
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Approve join request success")
      );
    });
  });

  describe("rejectJoinRequest", () => {
    it("should reject join request successfully", async () => {
      const req = createMockRequest({
        params: {
          groupId: "group-1",
          requestId: "request-1"
        },
        headers: {
          "x-user-id": "admin-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "request-1", status: "rejected" };

      mockCgeService.rejectJoinRequest.mockResolvedValue(result);

      await controller.rejectJoinRequest(req, res, next);

      expect(mockCgeService.rejectJoinRequest).toHaveBeenCalledWith(
        "group-1",
        "request-1",
        "admin-1"
      );
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Reject join request success")
      );
    });
  });

  describe("removeGroupMember", () => {
    it("should remove group member successfully", async () => {
      const req = createMockRequest({
        params: {
          groupId: "group-1",
          userId: "user-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { user_id: "user-1" };

      mockCgeService.removeGroupMember.mockResolvedValue(result);

      await controller.removeGroupMember(req, res, next);

      expect(mockCgeService.removeGroupMember).toHaveBeenCalledWith(
        "group-1",
        "user-1"
      );
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Remove group member success")
      );
    });
  });

  describe("leaveGroup", () => {
    it("should leave group successfully", async () => {
      const req = createMockRequest({
        params: { groupId: "group-1" },
        headers: { "x-user-id": "user-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { status: "left" };

      mockCgeService.leaveGroup.mockResolvedValue(result);

      await controller.leaveGroup(req, res, next);

      expect(mockCgeService.leaveGroup).toHaveBeenCalledWith("group-1", "user-1");
      expect(res.json).toHaveBeenCalledWith(ok(result, "Leave group success"));
    });
  });
});