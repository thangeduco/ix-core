import express from "express";
import request from "supertest";

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

import { cgeRoutes } from "../../../src/modules/cge/routes/cge.routes";

describe("CGE HTTP-level test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/cge", cgeRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /cge/health", async () => {
    const res = await request(app).get("/cge/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "cge",
      ok: true
    });
  });

  it("GET /cge/classes should return classes", async () => {
    mockCgeService.listClasses.mockResolvedValue([{ id: "class-1" }]);

    const res = await request(app).get("/cge/classes").query({
      course_id: "course-1"
    });

    expect(res.status).toBe(200);
    expect(mockCgeService.listClasses).toHaveBeenCalledWith("course-1");
    expect(res.body.data).toEqual([{ id: "class-1" }]);
  });

  it("POST /cge/classes should create class", async () => {
    mockCgeService.createClass.mockResolvedValue({ id: "class-1" });

    const res = await request(app).post("/cge/classes").send({
      course_id: "course-1",
      name: "Class A"
    });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("class-1");
  });

  it("POST /cge/classes/:classId/teachers should assign teacher", async () => {
    mockCgeService.assignTeacherToClass.mockResolvedValue({ id: "assign-1" });

    const res = await request(app)
      .post("/cge/classes/class-1/teachers")
      .send({
        teacher_user_id: "teacher-1",
        role_in_class: "main"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("assign-1");
  });

  it("GET /cge/enrollments should return enrollments", async () => {
    mockCgeService.listEnrollments.mockResolvedValue([{ id: "enrollment-1" }]);

    const res = await request(app).get("/cge/enrollments").query({
      course_id: "course-1",
      page: "1",
      limit: "10"
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([{ id: "enrollment-1" }]);
  });

  it("POST /cge/enrollments should create enrollment", async () => {
    mockCgeService.createEnrollment.mockResolvedValue({ id: "enrollment-1" });

    const res = await request(app).post("/cge/enrollments").send({
      course_id: "course-1",
      student_user_id: "student-1"
    });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("enrollment-1");
  });

  it("GET /cge/groups should return groups", async () => {
    mockCgeService.listGroups.mockResolvedValue([{ id: "group-1" }]);

    const res = await request(app).get("/cge/groups").query({
      owner_type: "student",
      page: "1",
      limit: "10"
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([{ id: "group-1" }]);
  });

  it("POST /cge/groups should create group", async () => {
    mockCgeService.createGroup.mockResolvedValue({ id: "group-1" });

    const res = await request(app)
      .post("/cge/groups")
      .set("x-user-id", "user-1")
      .send({
        name: "Group A",
        owner_type: "student"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("group-1");
  });

  it("GET /cge/groups/:groupId should return group detail", async () => {
    mockCgeService.getGroupDetail.mockResolvedValue({
      id: "group-1",
      members: []
    });

    const res = await request(app).get("/cge/groups/group-1");

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe("group-1");
  });

  it("PUT /cge/groups/:groupId should update group", async () => {
    mockCgeService.updateGroup.mockResolvedValue({
      id: "group-1",
      name: "Group Updated"
    });

    const res = await request(app).put("/cge/groups/group-1").send({
      name: "Group Updated"
    });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Group Updated");
  });

  it("POST /cge/groups/:groupId/invitations should invite members", async () => {
    mockCgeService.inviteMembers.mockResolvedValue([{ id: "member-1" }]);

    const res = await request(app)
      .post("/cge/groups/group-1/invitations")
      .send({
        user_ids: ["user-1"]
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual([{ id: "member-1" }]);
  });

  it("POST /cge/groups/:groupId/join-requests should create join request", async () => {
    mockCgeService.createJoinRequest.mockResolvedValue({ id: "request-1" });

    const res = await request(app)
      .post("/cge/groups/group-1/join-requests")
      .set("x-user-id", "user-1")
      .send({
        message: "Xin tham gia"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("request-1");
  });

  it("POST /cge/groups/:groupId/join-requests/:requestId/approve should approve join request", async () => {
    mockCgeService.approveJoinRequest.mockResolvedValue({
      id: "request-1",
      status: "approved"
    });

    const res = await request(app)
      .post("/cge/groups/group-1/join-requests/request-1/approve")
      .set("x-user-id", "admin-1")
      .send({
        member_role: "member"
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("approved");
  });

  it("POST /cge/groups/:groupId/join-requests/:requestId/reject should reject join request", async () => {
    mockCgeService.rejectJoinRequest.mockResolvedValue({
      id: "request-1",
      status: "rejected"
    });

    const res = await request(app)
      .post("/cge/groups/group-1/join-requests/request-1/reject")
      .set("x-user-id", "admin-1");

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("rejected");
  });

  it("DELETE /cge/groups/:groupId/members/:userId should remove member", async () => {
    mockCgeService.removeGroupMember.mockResolvedValue({
      user_id: "user-1"
    });

    const res = await request(app).delete("/cge/groups/group-1/members/user-1");

    expect(res.status).toBe(200);
    expect(res.body.data.user_id).toBe("user-1");
  });

  it("POST /cge/groups/:groupId/leave should leave group", async () => {
    mockCgeService.leaveGroup.mockResolvedValue({
      group_id: "group-1",
      user_id: "user-1",
      status: "left"
    });

    const res = await request(app)
      .post("/cge/groups/group-1/leave")
      .set("x-user-id", "user-1");

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("left");
  });

  it("POST /cge/classes should return validation error when body invalid", async () => {
    const res = await request(app).post("/cge/classes").send({
      course_id: "",
      name: "A"
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});