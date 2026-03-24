import express from "express";
import request from "supertest";

const mockGetReviewWorkspace = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getReviewWorkspace" });
});

const mockCreateWeeklyReview = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createWeeklyReview" });
});

const mockUpdateWeeklyReview = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "updateWeeklyReview" });
});

const mockGetWeeklyReviewDetail = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getWeeklyReviewDetail" });
});

const mockCreateTeacherAssignedTask = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createTeacherAssignedTask" });
});

const mockListTeacherAssignedTasks = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "listTeacherAssignedTasks" });
});

const mockCreateStudentHomeworkOverride = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createStudentHomeworkOverride" });
});

const mockCreateOfflineActivityRecord = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createOfflineActivityRecord" });
});

jest.mock("../../../src/modules/tew/controllers/tew.controller", () => {
  return {
    TewController: jest.fn().mockImplementation(() => ({
      getReviewWorkspace: mockGetReviewWorkspace,
      createWeeklyReview: mockCreateWeeklyReview,
      updateWeeklyReview: mockUpdateWeeklyReview,
      getWeeklyReviewDetail: mockGetWeeklyReviewDetail,
      createTeacherAssignedTask: mockCreateTeacherAssignedTask,
      listTeacherAssignedTasks: mockListTeacherAssignedTasks,
      createStudentHomeworkOverride: mockCreateStudentHomeworkOverride,
      createOfflineActivityRecord: mockCreateOfflineActivityRecord
    }))
  };
});

import { tewRoutes } from "../../../src/modules/tew/routes/tew.routes";

describe("tew.routes smoke test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/tew", tewRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /tew/health should return health response", async () => {
    const res = await request(app).get("/tew/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "tew",
      ok: true
    });
  });

  it("GET /tew/teacher/students/:studentId/weeks/:weekId/review-workspace should call controller.getReviewWorkspace", async () => {
    const res = await request(app).get(
      "/tew/teacher/students/student-1/weeks/week-1/review-workspace"
    );

    expect(res.status).toBe(200);
    expect(mockGetReviewWorkspace).toHaveBeenCalledTimes(1);
  });

  it("POST /tew/teacher/weekly-reviews should call controller.createWeeklyReview", async () => {
    const res = await request(app)
      .post("/tew/teacher/weekly-reviews")
      .send({
        student_user_id: "student-1",
        course_week_id: "week-1"
      });

    expect(res.status).toBe(201);
    expect(mockCreateWeeklyReview).toHaveBeenCalledTimes(1);
  });

  it("PUT /tew/teacher/weekly-reviews/:reviewId should call controller.updateWeeklyReview", async () => {
    const res = await request(app)
      .put("/tew/teacher/weekly-reviews/review-1")
      .send({
        overall_comment: "updated"
      });

    expect(res.status).toBe(200);
    expect(mockUpdateWeeklyReview).toHaveBeenCalledTimes(1);
  });

  it("GET /tew/weekly-reviews/:reviewId should call controller.getWeeklyReviewDetail", async () => {
    const res = await request(app).get("/tew/weekly-reviews/review-1");

    expect(res.status).toBe(200);
    expect(mockGetWeeklyReviewDetail).toHaveBeenCalledTimes(1);
  });

  it("GET /tew/teacher/assigned-tasks should call controller.listTeacherAssignedTasks", async () => {
    const res = await request(app).get("/tew/teacher/assigned-tasks");

    expect(res.status).toBe(200);
    expect(mockListTeacherAssignedTasks).toHaveBeenCalledTimes(1);
  });

  it("POST /tew/teacher/assigned-tasks should call controller.createTeacherAssignedTask", async () => {
    const res = await request(app)
      .post("/tew/teacher/assigned-tasks")
      .send({
        student_user_id: "student-1",
        parent_user_id: "parent-1",
        title: "Do homework"
      });

    expect(res.status).toBe(201);
    expect(mockCreateTeacherAssignedTask).toHaveBeenCalledTimes(1);
  });

  it("POST /tew/teacher/student-homework-overrides should call controller.createStudentHomeworkOverride", async () => {
    const res = await request(app)
      .post("/tew/teacher/student-homework-overrides")
      .send({
        student_user_id: "student-1",
        homework_sheet_id: "hw-1"
      });

    expect(res.status).toBe(201);
    expect(mockCreateStudentHomeworkOverride).toHaveBeenCalledTimes(1);
  });

  it("POST /tew/teacher/offline-activity-records should call controller.createOfflineActivityRecord", async () => {
    const res = await request(app)
      .post("/tew/teacher/offline-activity-records")
      .send({
        class_id: "class-1",
        course_week_id: "week-1",
        student_user_id: "student-1",
        activity_type: "participation"
      });

    expect(res.status).toBe(201);
    expect(mockCreateOfflineActivityRecord).toHaveBeenCalledTimes(1);
  });
});