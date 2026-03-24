import express from "express";
import request from "supertest";

const mockTewService = {
  getReviewWorkspace: jest.fn(),
  createWeeklyReview: jest.fn(),
  updateWeeklyReview: jest.fn(),
  getWeeklyReviewDetail: jest.fn(),
  createTeacherAssignedTask: jest.fn(),
  listTeacherAssignedTasks: jest.fn(),
  createStudentHomeworkOverride: jest.fn(),
  createOfflineActivityRecord: jest.fn()
};

jest.mock("../../../src/modules/tew/services/tew.service", () => {
  return {
    TewService: jest.fn().mockImplementation(() => mockTewService)
  };
});

import { tewRoutes } from "../../../src/modules/tew/routes/tew.routes";

describe("TEW HTTP-level test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/tew", tewRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /tew/health", async () => {
    const res = await request(app).get("/tew/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "tew",
      ok: true
    });
  });

  it("GET /tew/teacher/students/:studentId/weeks/:weekId/review-workspace should return workspace", async () => {
    mockTewService.getReviewWorkspace.mockResolvedValue({
      week_progress: null,
      quiz_attempts: [],
      homework_submissions: [],
      class_test_results: []
    });

    const res = await request(app).get(
      "/tew/teacher/students/student-1/weeks/week-1/review-workspace"
    );

    expect(res.status).toBe(200);
    expect(res.body.data.quiz_attempts).toEqual([]);
  });

  it("POST /tew/teacher/weekly-reviews should create weekly review", async () => {
    mockTewService.createWeeklyReview.mockResolvedValue({
      review: { id: "review-1" },
      scores: [],
      comments: []
    });

    const res = await request(app)
      .post("/tew/teacher/weekly-reviews")
      .set("x-user-id", "teacher-1")
      .send({
        student_user_id: "student-1",
        course_week_id: "week-1",
        overall_comment: "Great"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.review.id).toBe("review-1");
  });

  it("PUT /tew/teacher/weekly-reviews/:reviewId should update weekly review", async () => {
    mockTewService.updateWeeklyReview.mockResolvedValue({
      review: { id: "review-1" },
      scores: [],
      comments: []
    });

    const res = await request(app)
      .put("/tew/teacher/weekly-reviews/review-1")
      .send({
        overall_comment: "Updated"
      });

    expect(res.status).toBe(200);
    expect(res.body.data.review.id).toBe("review-1");
  });

  it("GET /tew/weekly-reviews/:reviewId should return review detail", async () => {
    mockTewService.getWeeklyReviewDetail.mockResolvedValue({
      review: { id: "review-1" },
      scores: [],
      comments: []
    });

    const res = await request(app).get("/tew/weekly-reviews/review-1");

    expect(res.status).toBe(200);
    expect(res.body.data.review.id).toBe("review-1");
  });

  it("GET /tew/teacher/assigned-tasks should return assigned tasks", async () => {
    mockTewService.listTeacherAssignedTasks.mockResolvedValue([{ id: "task-1" }]);

    const res = await request(app)
      .get("/tew/teacher/assigned-tasks")
      .query({
        student_user_id: "student-1",
        status: "pending",
        page: "1",
        limit: "10"
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([{ id: "task-1" }]);
  });

  it("POST /tew/teacher/assigned-tasks should create assigned task", async () => {
    mockTewService.createTeacherAssignedTask.mockResolvedValue({ id: "task-1" });

    const res = await request(app)
      .post("/tew/teacher/assigned-tasks")
      .send({
        student_user_id: "student-1",
        parent_user_id: "parent-1",
        title: "Do homework",
        description: "Finish before Sunday"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("task-1");
  });

  it("POST /tew/teacher/student-homework-overrides should create override", async () => {
    mockTewService.createStudentHomeworkOverride.mockResolvedValue({
      id: "override-1"
    });

    const res = await request(app)
      .post("/tew/teacher/student-homework-overrides")
      .set("x-user-id", "teacher-1")
      .send({
        student_user_id: "student-1",
        homework_sheet_id: "hw-1",
        extra_instruction: "Redo question 2"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("override-1");
  });

  it("POST /tew/teacher/offline-activity-records should create offline activity record", async () => {
    mockTewService.createOfflineActivityRecord.mockResolvedValue({
      id: "offline-1"
    });

    const res = await request(app)
      .post("/tew/teacher/offline-activity-records")
      .set("x-user-id", "teacher-1")
      .send({
        class_id: "class-1",
        course_week_id: "week-1",
        student_user_id: "student-1",
        activity_type: "participation",
        score: 9
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("offline-1");
  });

  it("POST /tew/teacher/weekly-reviews should return validation error when body invalid", async () => {
    const res = await request(app)
      .post("/tew/teacher/weekly-reviews")
      .send({
        course_week_id: "week-1"
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("POST /tew/teacher/assigned-tasks should return validation error when body invalid", async () => {
    const res = await request(app)
      .post("/tew/teacher/assigned-tasks")
      .send({
        student_user_id: "student-1",
        title: "a"
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("POST /tew/teacher/offline-activity-records should return validation error when body invalid", async () => {
    const res = await request(app)
      .post("/tew/teacher/offline-activity-records")
      .send({
        class_id: "class-1"
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});