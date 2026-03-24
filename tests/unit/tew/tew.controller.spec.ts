import { ok } from "../../../src/shared/utils/response";

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

import { TewController } from "../../../src/modules/tew/controllers/tew.controller";

describe("TewController unit test", () => {
  let controller: TewController;

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
    controller = new TewController();
  });

  describe("getReviewWorkspace", () => {
    it("should get review workspace successfully", async () => {
      const req = createMockRequest({
        params: {
          studentId: "student-1",
          weekId: "week-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = {
        week_progress: null,
        quiz_attempts: [],
        homework_submissions: [],
        class_test_results: []
      };

      mockTewService.getReviewWorkspace.mockResolvedValue(result);

      await controller.getReviewWorkspace(req, res, next);

      expect(mockTewService.getReviewWorkspace).toHaveBeenCalledWith(
        "student-1",
        "week-1"
      );
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get review workspace success")
      );
    });

    it("should call next when route param missing", async () => {
      const req = createMockRequest({
        params: {
          weekId: "week-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getReviewWorkspace(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("createWeeklyReview", () => {
    it("should create weekly review with x-user-id header", async () => {
      const req = createMockRequest({
        headers: { "x-user-id": "teacher-1" },
        body: {
          student_user_id: "student-1",
          course_week_id: "week-1",
          overall_comment: "Good",
          scores: [
            {
              score_type: "overall_score",
              score_value: 9,
              max_score: 10
            }
          ],
          comments: [
            {
              comment_type: "overall_comment",
              comment_text: "Well done"
            }
          ]
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = {
        review: { id: "review-1" },
        scores: [],
        comments: []
      };

      mockTewService.createWeeklyReview.mockResolvedValue(result);

      await controller.createWeeklyReview(req, res, next);

      expect(mockTewService.createWeeklyReview).toHaveBeenCalledWith({
        student_user_id: "student-1",
        course_week_id: "week-1",
        overall_comment: "Good",
        scores: [
          {
            score_type: "overall_score",
            score_value: 9,
            max_score: 10
          }
        ],
        comments: [
          {
            comment_type: "overall_comment",
            comment_text: "Well done"
          }
        ],
        teacher_user_id: "teacher-1"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Create weekly review success")
      );
    });

    it("should fallback teacher_user_id to mock-teacher-id", async () => {
      const req = createMockRequest({
        body: {
          student_user_id: "student-1",
          course_week_id: "week-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      mockTewService.createWeeklyReview.mockResolvedValue({
        review: { id: "review-1" },
        scores: [],
        comments: []
      });

      await controller.createWeeklyReview(req, res, next);

      expect(mockTewService.createWeeklyReview).toHaveBeenCalledWith({
        student_user_id: "student-1",
        course_week_id: "week-1",
        teacher_user_id: "mock-teacher-id"
      });
    });

    it("should call next when body invalid", async () => {
      const req = createMockRequest({
        body: {
          course_week_id: "week-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.createWeeklyReview(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("updateWeeklyReview", () => {
    it("should update weekly review successfully", async () => {
      const req = createMockRequest({
        params: { reviewId: "review-1" },
        body: {
          overall_comment: "Updated comment",
          scores: [
            {
              score_type: "lesson_score",
              score_value: 8
            }
          ]
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = {
        review: { id: "review-1" },
        scores: [],
        comments: []
      };

      mockTewService.updateWeeklyReview.mockResolvedValue(result);

      await controller.updateWeeklyReview(req, res, next);

      expect(mockTewService.updateWeeklyReview).toHaveBeenCalledWith("review-1", {
        overall_comment: "Updated comment",
        scores: [
          {
            score_type: "lesson_score",
            score_value: 8
          }
        ]
      });
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Update weekly review success")
      );
    });

    it("should call next when reviewId missing", async () => {
      const req = createMockRequest({
        params: {},
        body: {
          overall_comment: "Updated"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.updateWeeklyReview(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("getWeeklyReviewDetail", () => {
    it("should get weekly review detail successfully", async () => {
      const req = createMockRequest({
        params: { reviewId: "review-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = {
        review: { id: "review-1" },
        scores: [],
        comments: []
      };

      mockTewService.getWeeklyReviewDetail.mockResolvedValue(result);

      await controller.getWeeklyReviewDetail(req, res, next);

      expect(mockTewService.getWeeklyReviewDetail).toHaveBeenCalledWith("review-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get weekly review detail success")
      );
    });
  });

  describe("createTeacherAssignedTask", () => {
    it("should create teacher assigned task successfully", async () => {
      const req = createMockRequest({
        body: {
          student_user_id: "student-1",
          parent_user_id: "parent-1",
          title: "Task 1",
          description: "desc",
          status: "pending"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "task-1" };

      mockTewService.createTeacherAssignedTask.mockResolvedValue(result);

      await controller.createTeacherAssignedTask(req, res, next);

      expect(mockTewService.createTeacherAssignedTask).toHaveBeenCalledWith({
        student_user_id: "student-1",
        parent_user_id: "parent-1",
        title: "Task 1",
        description: "desc",
        status: "pending"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Create teacher assigned task success")
      );
    });

    it("should call next when body invalid", async () => {
      const req = createMockRequest({
        body: {
          student_user_id: "student-1",
          title: "A"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.createTeacherAssignedTask(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("listTeacherAssignedTasks", () => {
    it("should list teacher assigned tasks successfully", async () => {
      const req = createMockRequest({
        query: {
          student_user_id: "student-1",
          status: "pending",
          page: "1",
          limit: "10"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "task-1" }];

      mockTewService.listTeacherAssignedTasks.mockResolvedValue(result);

      await controller.listTeacherAssignedTasks(req, res, next);

      expect(mockTewService.listTeacherAssignedTasks).toHaveBeenCalledWith({
        student_user_id: "student-1",
        status: "pending",
        page: "1",
        limit: "10"
      });
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "List teacher assigned tasks success")
      );
    });
  });

  describe("createStudentHomeworkOverride", () => {
    it("should create student homework override with x-user-id header", async () => {
      const req = createMockRequest({
        headers: { "x-user-id": "teacher-1" },
        body: {
          student_user_id: "student-1",
          homework_sheet_id: "hw-1",
          extra_instruction: "Focus more"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "override-1" };

      mockTewService.createStudentHomeworkOverride.mockResolvedValue(result);

      await controller.createStudentHomeworkOverride(req, res, next);

      expect(mockTewService.createStudentHomeworkOverride).toHaveBeenCalledWith({
        student_user_id: "student-1",
        homework_sheet_id: "hw-1",
        extra_instruction: "Focus more",
        created_by: "teacher-1"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Create student homework override success")
      );
    });

    it("should fallback created_by to mock-teacher-id", async () => {
      const req = createMockRequest({
        body: {
          student_user_id: "student-1",
          homework_sheet_id: "hw-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      mockTewService.createStudentHomeworkOverride.mockResolvedValue({
        id: "override-1"
      });

      await controller.createStudentHomeworkOverride(req, res, next);

      expect(mockTewService.createStudentHomeworkOverride).toHaveBeenCalledWith({
        student_user_id: "student-1",
        homework_sheet_id: "hw-1",
        created_by: "mock-teacher-id"
      });
    });
  });

  describe("createOfflineActivityRecord", () => {
    it("should create offline activity record with x-user-id header", async () => {
      const req = createMockRequest({
        headers: { "x-user-id": "teacher-1" },
        body: {
          class_id: "class-1",
          course_week_id: "week-1",
          student_user_id: "student-1",
          activity_type: "participation",
          score: 8,
          comment: "Good"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "offline-1" };

      mockTewService.createOfflineActivityRecord.mockResolvedValue(result);

      await controller.createOfflineActivityRecord(req, res, next);

      expect(mockTewService.createOfflineActivityRecord).toHaveBeenCalledWith({
        class_id: "class-1",
        course_week_id: "week-1",
        student_user_id: "student-1",
        activity_type: "participation",
        score: 8,
        comment: "Good",
        recorded_by: "teacher-1"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Create offline activity record success")
      );
    });

    it("should call next when body invalid", async () => {
      const req = createMockRequest({
        body: {
          class_id: "class-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.createOfflineActivityRecord(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});