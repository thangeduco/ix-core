import express from "express";
import request from "supertest";

const mockPseService = {
  getWeeklyTasks: jest.fn(),
  getWeeklySummary: jest.fn(),
  getStudentRanking: jest.fn(),
  getStudentGroups: jest.fn(),
  createParentTask: jest.fn(),
  updateParentTask: jest.fn(),
  getParentTasks: jest.fn()
};

jest.mock("../../../src/modules/pse/services/pse.service", () => {
  return {
    PseService: jest.fn().mockImplementation(() => mockPseService)
  };
});

import { pseRoutes } from "../../../src/modules/pse/routes/pse.routes";

describe("PSE HTTP-level test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/pse", pseRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /pse/health", async () => {
    const res = await request(app).get("/pse/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "pse",
      ok: true
    });
  });

  it("GET /pse/weekly-tasks should return weekly tasks", async () => {
    mockPseService.getWeeklyTasks.mockResolvedValue([
      { id: "task-1", student_user_id: "student-1" }
    ]);

    const res = await request(app).get("/pse/weekly-tasks").query({
      student_user_id: "student-1",
      week_id: "week-1"
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([
      { id: "task-1", student_user_id: "student-1" }
    ]);
  });

  it("GET /pse/weekly-summary should return weekly summary", async () => {
    mockPseService.getWeeklySummary.mockResolvedValue({
      student_user_id: "student-1",
      course_week_id: "week-1",
      completion_rate: 0.85,
      total_score: 92,
      ranking: 1,
      teacher_comment: "Excellent"
    });

    const res = await request(app).get("/pse/weekly-summary").query({
      student_user_id: "student-1",
      week_id: "week-1"
    });

    expect(res.status).toBe(200);
    expect(res.body.data.student_user_id).toBe("student-1");
  });

  it("GET /pse/students/:studentId/ranking should return ranking history", async () => {
    mockPseService.getStudentRanking.mockResolvedValue([
      { id: "rank-1", student_user_id: "student-1", rank: 2 }
    ]);

    const res = await request(app).get("/pse/students/student-1/ranking");

    expect(res.status).toBe(200);
    expect(res.body.data[0].student_user_id).toBe("student-1");
  });

  it("GET /pse/students/:studentId/groups should return student groups", async () => {
    mockPseService.getStudentGroups.mockResolvedValue([
      { id: "group-1", name: "Math Group" }
    ]);

    const res = await request(app).get("/pse/students/student-1/groups");

    expect(res.status).toBe(200);
    expect(res.body.data[0].id).toBe("group-1");
  });

  it("POST /pse/parent-tasks should create parent task", async () => {
    mockPseService.createParentTask.mockResolvedValue({
      id: "task-1",
      student_user_id: "student-1",
      parent_user_id: "parent-1",
      title: "Practice math"
    });

    const res = await request(app)
      .post("/pse/parent-tasks")
      .send({
        student_user_id: "student-1",
        parent_user_id: "parent-1",
        title: "Practice math",
        description: "Do 10 exercises"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("task-1");
  });

  it("PUT /pse/parent-tasks/:taskId should update parent task", async () => {
    mockPseService.updateParentTask.mockResolvedValue({
      id: "task-1",
      status: "completed"
    });

    const res = await request(app)
      .put("/pse/parent-tasks/task-1")
      .send({
        status: "completed"
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("completed");
  });

  it("GET /pse/parents/:parentId/tasks should return parent tasks", async () => {
    mockPseService.getParentTasks.mockResolvedValue([
      { id: "task-1", parent_user_id: "parent-1" }
    ]);

    const res = await request(app).get("/pse/parents/parent-1/tasks");

    expect(res.status).toBe(200);
    expect(res.body.data[0].parent_user_id).toBe("parent-1");
  });

  it("GET /pse/weekly-tasks should return validation error when query invalid", async () => {
    const res = await request(app).get("/pse/weekly-tasks").query({
      student_user_id: "student-1"
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("GET /pse/weekly-summary should return validation error when query invalid", async () => {
    const res = await request(app).get("/pse/weekly-summary").query({
      week_id: "week-1"
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("POST /pse/parent-tasks should return validation error when body invalid", async () => {
    const res = await request(app)
      .post("/pse/parent-tasks")
      .send({
        student_user_id: "student-1",
        parent_user_id: "parent-1",
        title: "A"
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("PUT /pse/parent-tasks/:taskId should return validation error when body invalid", async () => {
    const res = await request(app)
      .put("/pse/parent-tasks/task-1")
      .send({
        status: "done"
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});