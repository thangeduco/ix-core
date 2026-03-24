import { ok } from "../../../src/shared/utils/response";

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

import { SlpController } from "../../../src/modules/slp/controllers/slp.controller";

describe("SlpController unit test", () => {
  let controller: SlpController;

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
    controller = new SlpController();
  });

  describe("calculateRanking", () => {
    it("should calculate ranking successfully", async () => {
      const req = createMockRequest({
        body: {
          scope: "class",
          scope_id: "class-1",
          period: "weekly",
          course_id: "course-1",
          week_id: "week-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [
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
      ];

      mockSlpService.calculateRanking.mockResolvedValue(result);

      await controller.calculateRanking(req, res, next);

      expect(mockSlpService.calculateRanking).toHaveBeenCalledWith({
        scope: "class",
        scope_id: "class-1",
        period: "weekly",
        course_id: "course-1",
        week_id: "week-1"
      });
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Calculate ranking success")
      );
    });

    it("should call next when body invalid", async () => {
      const req = createMockRequest({
        body: {
          scope: "invalid",
          period: "weekly",
          course_id: "course-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.calculateRanking(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("getRanking", () => {
    it("should get ranking successfully", async () => {
      const req = createMockRequest({
        query: {
          scope: "group",
          scope_id: "group-1",
          period: "course",
          course_id: "course-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [
        {
          id: "rank-1",
          student_user_id: "student-1",
          rank: 1,
          score: 100
        }
      ];

      mockSlpService.getRanking.mockResolvedValue(result);

      await controller.getRanking(req, res, next);

      expect(mockSlpService.getRanking).toHaveBeenCalledWith({
        scope: "group",
        scope_id: "group-1",
        period: "course",
        course_id: "course-1"
      });
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get ranking success")
      );
    });

    it("should call next when query invalid", async () => {
      const req = createMockRequest({
        query: {
          scope: "class",
          period: "weekly"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getRanking(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("compareRanking", () => {
    it("should compare ranking successfully", async () => {
      const req = createMockRequest({
        query: {
          student_user_id: "student-1",
          course_id: "course-1",
          week_id: "week-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [
        {
          id: "rank-1",
          student_user_id: "student-1",
          rank: 2,
          score: 88
        }
      ];

      mockSlpService.compareRanking.mockResolvedValue(result);

      await controller.compareRanking(req, res, next);

      expect(mockSlpService.compareRanking).toHaveBeenCalledWith("student-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Compare ranking success")
      );
    });

    it("should call next when query invalid", async () => {
      const req = createMockRequest({
        query: {
          course_id: "course-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.compareRanking(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});