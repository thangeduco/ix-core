import { ok } from "../../../src/shared/utils/response";

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

import { PseController } from "../../../src/modules/pse/controllers/pse.controller";

describe("PseController unit test", () => {
  let controller: PseController;

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
    controller = new PseController();
  });

  describe("getWeeklyTasks", () => {
    it("should get weekly tasks successfully", async () => {
      const req = createMockRequest({
        query: {
          student_user_id: "student-1",
          week_id: "week-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "task-1" }];

      mockPseService.getWeeklyTasks.mockResolvedValue(result);

      await controller.getWeeklyTasks(req, res, next);

      expect(mockPseService.getWeeklyTasks).toHaveBeenCalledWith(
        "student-1",
        "week-1"
      );
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get weekly tasks success")
      );
    });

    it("should call next when query invalid", async () => {
      const req = createMockRequest({
        query: {
          student_user_id: "student-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getWeeklyTasks(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("getWeeklySummary", () => {
    it("should get weekly summary successfully", async () => {
      const req = createMockRequest({
        query: {
          student_user_id: "student-1",
          week_id: "week-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = {
        student_user_id: "student-1",
        course_week_id: "week-1",
        completion_rate: 0.8,
        total_score: 90,
        ranking: 2,
        teacher_comment: "Good"
      };

      mockPseService.getWeeklySummary.mockResolvedValue(result);

      await controller.getWeeklySummary(req, res, next);

      expect(mockPseService.getWeeklySummary).toHaveBeenCalledWith(
        "student-1",
        "week-1"
      );
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get weekly summary success")
      );
    });

    it("should call next when query invalid", async () => {
      const req = createMockRequest({
        query: {
          week_id: "week-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getWeeklySummary(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("getStudentRanking", () => {
    it("should get student ranking successfully", async () => {
      const req = createMockRequest({
        params: { studentId: "student-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "rank-1", student_user_id: "student-1" }];

      mockPseService.getStudentRanking.mockResolvedValue(result);

      await controller.getStudentRanking(req, res, next);

      expect(mockPseService.getStudentRanking).toHaveBeenCalledWith("student-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get student ranking success")
      );
    });

    it("should call next when studentId missing", async () => {
      const req = createMockRequest({
        params: {}
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getStudentRanking(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("getStudentGroups", () => {
    it("should get student groups successfully", async () => {
      const req = createMockRequest({
        params: { studentId: "student-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "group-1", name: "Math Group" }];

      mockPseService.getStudentGroups.mockResolvedValue(result);

      await controller.getStudentGroups(req, res, next);

      expect(mockPseService.getStudentGroups).toHaveBeenCalledWith("student-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get student groups success")
      );
    });
  });

  describe("createParentTask", () => {
    it("should create parent task successfully", async () => {
      const req = createMockRequest({
        body: {
          student_user_id: "student-1",
          parent_user_id: "parent-1",
          title: "Practice math",
          description: "Do 10 exercises"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "parent-task-1" };

      mockPseService.createParentTask.mockResolvedValue(result);

      await controller.createParentTask(req, res, next);

      expect(mockPseService.createParentTask).toHaveBeenCalledWith({
        student_user_id: "student-1",
        parent_user_id: "parent-1",
        title: "Practice math",
        description: "Do 10 exercises"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Create parent task success")
      );
    });

    it("should call next when body invalid", async () => {
      const req = createMockRequest({
        body: {
          student_user_id: "student-1",
          parent_user_id: "parent-1",
          title: "A"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.createParentTask(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("updateParentTask", () => {
    it("should update parent task successfully", async () => {
      const req = createMockRequest({
        params: { taskId: "task-1" },
        body: {
          status: "completed"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "task-1", status: "completed" };

      mockPseService.updateParentTask.mockResolvedValue(result);

      await controller.updateParentTask(req, res, next);

      expect(mockPseService.updateParentTask).toHaveBeenCalledWith(
        "task-1",
        "completed"
      );
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Update parent task success")
      );
    });

    it("should call next when taskId missing", async () => {
      const req = createMockRequest({
        params: {},
        body: {
          status: "completed"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.updateParentTask(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should call next when body invalid", async () => {
      const req = createMockRequest({
        params: { taskId: "task-1" },
        body: {
          status: "done"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.updateParentTask(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("getParentTasks", () => {
    it("should get parent tasks successfully", async () => {
      const req = createMockRequest({
        params: { parentId: "parent-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "task-1", parent_user_id: "parent-1" }];

      mockPseService.getParentTasks.mockResolvedValue(result);

      await controller.getParentTasks(req, res, next);

      expect(mockPseService.getParentTasks).toHaveBeenCalledWith("parent-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get parent tasks success")
      );
    });

    it("should call next when parentId missing", async () => {
      const req = createMockRequest({
        params: {}
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getParentTasks(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});