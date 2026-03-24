import express from "express";
import request from "supertest";

const mockGetWeeklyTasks = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getWeeklyTasks" });
});

const mockGetWeeklySummary = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getWeeklySummary" });
});

const mockGetStudentRanking = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getStudentRanking" });
});

const mockGetStudentGroups = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getStudentGroups" });
});

const mockCreateParentTask = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createParentTask" });
});

const mockUpdateParentTask = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "updateParentTask" });
});

const mockGetParentTasks = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getParentTasks" });
});

jest.mock("../../../src/modules/pse/controllers/pse.controller", () => {
  return {
    PseController: jest.fn().mockImplementation(() => ({
      getWeeklyTasks: mockGetWeeklyTasks,
      getWeeklySummary: mockGetWeeklySummary,
      getStudentRanking: mockGetStudentRanking,
      getStudentGroups: mockGetStudentGroups,
      createParentTask: mockCreateParentTask,
      updateParentTask: mockUpdateParentTask,
      getParentTasks: mockGetParentTasks
    }))
  };
});

import { pseRoutes } from "../../../src/modules/pse/routes/pse.routes";

describe("pse.routes smoke test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/pse", pseRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /pse/health should return health response", async () => {
    const res = await request(app).get("/pse/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "pse",
      ok: true
    });
  });

  it("GET /pse/weekly-tasks should call controller.getWeeklyTasks", async () => {
    const res = await request(app).get("/pse/weekly-tasks").query({
      student_user_id: "student-1",
      week_id: "week-1"
    });

    expect(res.status).toBe(200);
    expect(mockGetWeeklyTasks).toHaveBeenCalledTimes(1);
  });

  it("GET /pse/weekly-summary should call controller.getWeeklySummary", async () => {
    const res = await request(app).get("/pse/weekly-summary").query({
      student_user_id: "student-1",
      week_id: "week-1"
    });

    expect(res.status).toBe(200);
    expect(mockGetWeeklySummary).toHaveBeenCalledTimes(1);
  });

  it("GET /pse/students/:studentId/ranking should call controller.getStudentRanking", async () => {
    const res = await request(app).get("/pse/students/student-1/ranking");

    expect(res.status).toBe(200);
    expect(mockGetStudentRanking).toHaveBeenCalledTimes(1);
  });

  it("GET /pse/students/:studentId/groups should call controller.getStudentGroups", async () => {
    const res = await request(app).get("/pse/students/student-1/groups");

    expect(res.status).toBe(200);
    expect(mockGetStudentGroups).toHaveBeenCalledTimes(1);
  });

  it("POST /pse/parent-tasks should call controller.createParentTask", async () => {
    const res = await request(app)
      .post("/pse/parent-tasks")
      .send({
        student_user_id: "student-1",
        parent_user_id: "parent-1",
        title: "Do homework",
        description: "Complete exercises"
      });

    expect(res.status).toBe(201);
    expect(mockCreateParentTask).toHaveBeenCalledTimes(1);
  });

  it("PUT /pse/parent-tasks/:taskId should call controller.updateParentTask", async () => {
    const res = await request(app)
      .put("/pse/parent-tasks/task-1")
      .send({
        status: "completed"
      });

    expect(res.status).toBe(200);
    expect(mockUpdateParentTask).toHaveBeenCalledTimes(1);
  });

  it("GET /pse/parents/:parentId/tasks should call controller.getParentTasks", async () => {
    const res = await request(app).get("/pse/parents/parent-1/tasks");

    expect(res.status).toBe(200);
    expect(mockGetParentTasks).toHaveBeenCalledTimes(1);
  });
});