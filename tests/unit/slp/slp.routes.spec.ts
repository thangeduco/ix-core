import express from "express";
import request from "supertest";

const mockCalculateRanking = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "calculateRanking" });
});

const mockGetRanking = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getRanking" });
});

const mockCompareRanking = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "compareRanking" });
});

jest.mock("../../../src/modules/slp/controllers/slp.controller", () => {
  return {
    SlpController: jest.fn().mockImplementation(() => ({
      calculateRanking: mockCalculateRanking,
      getRanking: mockGetRanking,
      compareRanking: mockCompareRanking
    }))
  };
});

import { slpRoutes } from "../../../src/modules/slp/routes/slp.routes";

describe("slp.routes smoke test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/slp", slpRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /slp/health should return health response", async () => {
    const res = await request(app).get("/slp/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "slp",
      ok: true
    });
  });

  it("POST /slp/rankings/calculate should call controller.calculateRanking", async () => {
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
    expect(mockCalculateRanking).toHaveBeenCalledTimes(1);
  });

  it("GET /slp/rankings should call controller.getRanking", async () => {
    const res = await request(app).get("/slp/rankings").query({
      scope: "class",
      scope_id: "class-1",
      period: "weekly",
      course_id: "course-1",
      week_id: "week-1"
    });

    expect(res.status).toBe(200);
    expect(mockGetRanking).toHaveBeenCalledTimes(1);
  });

  it("GET /slp/rankings/compare should call controller.compareRanking", async () => {
    const res = await request(app).get("/slp/rankings/compare").query({
      student_user_id: "student-1",
      course_id: "course-1",
      week_id: "week-1"
    });

    expect(res.status).toBe(200);
    expect(mockCompareRanking).toHaveBeenCalledTimes(1);
  });
});