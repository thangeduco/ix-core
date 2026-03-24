import express from "express";
import request from "supertest";

const mockListClasses = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "listClasses" });
});

const mockCreateClass = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createClass" });
});

const mockAssignTeacherToClass = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "assignTeacherToClass" });
});

const mockCreateEnrollment = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createEnrollment" });
});

const mockListEnrollments = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "listEnrollments" });
});

const mockCreateGroup = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createGroup" });
});

const mockListGroups = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "listGroups" });
});

const mockGetGroupDetail = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getGroupDetail" });
});

const mockUpdateGroup = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "updateGroup" });
});

const mockInviteMembers = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "inviteMembers" });
});

const mockCreateJoinRequest = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createJoinRequest" });
});

const mockApproveJoinRequest = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "approveJoinRequest" });
});

const mockRejectJoinRequest = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "rejectJoinRequest" });
});

const mockRemoveGroupMember = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "removeGroupMember" });
});

const mockLeaveGroup = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "leaveGroup" });
});

jest.mock("../../../src/modules/cge/controllers/cge.controller", () => {
  return {
    CgeController: jest.fn().mockImplementation(() => ({
      listClasses: mockListClasses,
      createClass: mockCreateClass,
      assignTeacherToClass: mockAssignTeacherToClass,
      createEnrollment: mockCreateEnrollment,
      listEnrollments: mockListEnrollments,
      createGroup: mockCreateGroup,
      listGroups: mockListGroups,
      getGroupDetail: mockGetGroupDetail,
      updateGroup: mockUpdateGroup,
      inviteMembers: mockInviteMembers,
      createJoinRequest: mockCreateJoinRequest,
      approveJoinRequest: mockApproveJoinRequest,
      rejectJoinRequest: mockRejectJoinRequest,
      removeGroupMember: mockRemoveGroupMember,
      leaveGroup: mockLeaveGroup
    }))
  };
});

import { cgeRoutes } from "../../../src/modules/cge/routes/cge.routes";

describe("cge.routes smoke test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/cge", cgeRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /cge/health should return health response", async () => {
    const res = await request(app).get("/cge/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "cge",
      ok: true
    });
  });

  it("GET /cge/classes should call controller.listClasses", async () => {
    const res = await request(app).get("/cge/classes");

    expect(res.status).toBe(200);
    expect(mockListClasses).toHaveBeenCalledTimes(1);
  });

  it("POST /cge/classes should call controller.createClass", async () => {
    const res = await request(app).post("/cge/classes").send({
      course_id: "course-1",
      name: "Class A"
    });

    expect(res.status).toBe(201);
    expect(mockCreateClass).toHaveBeenCalledTimes(1);
  });

  it("POST /cge/classes/:classId/teachers should call controller.assignTeacherToClass", async () => {
    const res = await request(app).post("/cge/classes/class-1/teachers").send({
      teacher_user_id: "teacher-1",
      role_in_class: "main"
    });

    expect(res.status).toBe(201);
    expect(mockAssignTeacherToClass).toHaveBeenCalledTimes(1);
  });

  it("GET /cge/enrollments should call controller.listEnrollments", async () => {
    const res = await request(app).get("/cge/enrollments");

    expect(res.status).toBe(200);
    expect(mockListEnrollments).toHaveBeenCalledTimes(1);
  });

  it("POST /cge/enrollments should call controller.createEnrollment", async () => {
    const res = await request(app).post("/cge/enrollments").send({
      course_id: "course-1",
      student_user_id: "student-1"
    });

    expect(res.status).toBe(201);
    expect(mockCreateEnrollment).toHaveBeenCalledTimes(1);
  });

  it("GET /cge/groups should call controller.listGroups", async () => {
    const res = await request(app).get("/cge/groups");

    expect(res.status).toBe(200);
    expect(mockListGroups).toHaveBeenCalledTimes(1);
  });

  it("POST /cge/groups should call controller.createGroup", async () => {
    const res = await request(app)
      .post("/cge/groups")
      .send({
        name: "Group A",
        owner_type: "student"
      });

    expect(res.status).toBe(201);
    expect(mockCreateGroup).toHaveBeenCalledTimes(1);
  });

  it("GET /cge/groups/:groupId should call controller.getGroupDetail", async () => {
    const res = await request(app).get("/cge/groups/group-1");

    expect(res.status).toBe(200);
    expect(mockGetGroupDetail).toHaveBeenCalledTimes(1);
  });

  it("PUT /cge/groups/:groupId should call controller.updateGroup", async () => {
    const res = await request(app).put("/cge/groups/group-1").send({
      name: "Group A Updated"
    });

    expect(res.status).toBe(200);
    expect(mockUpdateGroup).toHaveBeenCalledTimes(1);
  });

  it("POST /cge/groups/:groupId/invitations should call controller.inviteMembers", async () => {
    const res = await request(app)
      .post("/cge/groups/group-1/invitations")
      .send({
        user_ids: ["user-1", "user-2"]
      });

    expect(res.status).toBe(201);
    expect(mockInviteMembers).toHaveBeenCalledTimes(1);
  });

  it("POST /cge/groups/:groupId/join-requests should call controller.createJoinRequest", async () => {
    const res = await request(app)
      .post("/cge/groups/group-1/join-requests")
      .send({
        message: "Xin tham gia"
      });

    expect(res.status).toBe(201);
    expect(mockCreateJoinRequest).toHaveBeenCalledTimes(1);
  });

  it("POST /cge/groups/:groupId/join-requests/:requestId/approve should call controller.approveJoinRequest", async () => {
    const res = await request(app)
      .post("/cge/groups/group-1/join-requests/request-1/approve")
      .send({
        member_role: "member"
      });

    expect(res.status).toBe(200);
    expect(mockApproveJoinRequest).toHaveBeenCalledTimes(1);
  });

  it("POST /cge/groups/:groupId/join-requests/:requestId/reject should call controller.rejectJoinRequest", async () => {
    const res = await request(app).post(
      "/cge/groups/group-1/join-requests/request-1/reject"
    );

    expect(res.status).toBe(200);
    expect(mockRejectJoinRequest).toHaveBeenCalledTimes(1);
  });

  it("DELETE /cge/groups/:groupId/members/:userId should call controller.removeGroupMember", async () => {
    const res = await request(app).delete("/cge/groups/group-1/members/user-1");

    expect(res.status).toBe(200);
    expect(mockRemoveGroupMember).toHaveBeenCalledTimes(1);
  });

  it("POST /cge/groups/:groupId/leave should call controller.leaveGroup", async () => {
    const res = await request(app).post("/cge/groups/group-1/leave");

    expect(res.status).toBe(200);
    expect(mockLeaveGroup).toHaveBeenCalledTimes(1);
  });
});