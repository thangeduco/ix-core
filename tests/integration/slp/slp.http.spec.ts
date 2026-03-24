import express from "express";
import request from "supertest";

const mockSlpService = {
  calculateRanking: jest.fn(),
  getRanking: jest.fn(),
  compareRanking: jest.fn()
};

jest.mock("../../../src/modules/slp/services/slp.service", () => {
  return {
    SlpService: jest.fn().mockImplementation(() => mockSlpService)
  };
});

import { slpRoutes } from "../../../src/modules/slp/routes/slp.routes";

describe("SLP HTTP-level test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/slp", slpRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /slp/health", async () => {
    const res = await request(app).get("/slp/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "slp",
      ok: true
    });
  });

  it("POST /slp/rankings/calculate should calculate ranking", async () => {
    mockSlpService.calculateRanking.mockResolvedValue([
      {
        student_user_id: "student-1",
        scope: "class",
        scope_id: "class-1",
        period: "weekly",
        course_id: "course-1",
        course_week_id: "week-1",
        rank: 1,
        score: 95
      }
    ]);

    const res = await request(app)
      .post("/slp/rankings/calculate")
      .send({
        scope: "class",
        scope_id: "class-1",
        period: "weekly",
        course_id: "course-1",
        week_id: "week-1"
      });

    expect(res.status).toBe(200);
    expect(res.body.data[0].student_user_id).toBe("student-1");
    expect(res.body.data[0].rank).toBe(1);
  });

  it("GET /slp/rankings should return ranking list", async () => {
    mockSlpService.getRanking.mockResolvedValue([
      {
        id: "rank-1",
        student_user_id: "student-1",
        scope: "class",
        scope_id: "class-1",
        period: "weekly",
        course_id: "course-1",
        course_week_id: "week-1",
        rank: 1,
        score: 95
      }
    ]);

    const res = await request(app).get("/slp/rankings").query({
      scope: "class",
      scope_id: "class-1",
      period: "weekly",
      course_id: "course-1",
      week_id: "week-1"
    });

    expect(res.status).toBe(200);
    expect(res.body.data[0].id).toBe("rank-1");
  });

  it("GET /slp/rankings/compare should return ranking history", async () => {
    mockSlpService.compareRanking.mockResolvedValue([
      {
        id: "rank-1",
        student_user_id: "student-1",
        rank: 3,
        score: 82
      },
      {
        id: "rank-2",
        student_user_id: "student-1",
        rank: 1,
        score: 97
      }
    ]);

    const res = await request(app).get("/slp/rankings/compare").query({
      student_user_id: "student-1",
      course_id: "course-1",
      week_id: "week-1"
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].student_user_id).toBe("student-1");
  });

  it("POST /slp/rankings/calculate should return validation error when body invalid", async () => {
    const res = await request(app)
      .post("/slp/rankings/calculate")
      .send({
        scope: "abc",
        period: "weekly",
        course_id: "course-1"
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("GET /slp/rankings should return validation error when query invalid", async () => {
    const res = await request(app).get("/slp/rankings").query({
      scope: "class",
      period: "weekly"
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("GET /slp/rankings/compare should return validation error when query invalid", async () => {
    const res = await request(app).get("/slp/rankings/compare").query({
      course_id: "course-1"
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});