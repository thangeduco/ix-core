import { ok } from "../../../src/shared/utils/response";

const mockLsmService = {
  startVideoSession: jest.fn(),
  finishVideoSession: jest.fn(),
  createQuizAttempt: jest.fn(),
  getQuizAttemptDetail: jest.fn(),
  createHomeworkSubmission: jest.fn(),
  listHomeworkSubmissions: jest.fn(),
  getHomeworkSubmissionDetail: jest.fn(),
  createClassworkResult: jest.fn(),
  createClassTestResult: jest.fn(),
  createPeriodicExamResult: jest.fn(),
  getStudentWeekProgress: jest.fn(),
  getLearningHistory: jest.fn()
};

jest.mock("../../../src/modules/lsm/services/lsm.service", () => {
  return {
    LsmService: jest.fn().mockImplementation(() => mockLsmService)
  };
});

import { LsmController } from "../../../src/modules/lsm/controllers/lsm.controller";

describe("LsmController unit test", () => {
  let controller: LsmController;

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
    controller = new LsmController();
  });

  describe("startVideoSession", () => {
    it("should start video session with body student_user_id", async () => {
      const req = createMockRequest({
        params: { videoId: "video-1" },
        body: {
          student_user_id: "student-1",
          start_at: "2026-03-19T10:00:00Z"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "session-1" };

      mockLsmService.startVideoSession.mockResolvedValue(result);

      await controller.startVideoSession(req, res, next);

      expect(mockLsmService.startVideoSession).toHaveBeenCalledWith("video-1", {
        student_user_id: "student-1",
        start_at: "2026-03-19T10:00:00Z"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Start video session success")
      );
    });

    it("should fallback student_user_id from x-user-id header", async () => {
      const req = createMockRequest({
        params: { videoId: "video-1" },
        headers: { "x-user-id": "student-h" },
        body: {}
      });
      const res = createMockResponse();
      const next = createMockNext();

      mockLsmService.startVideoSession.mockResolvedValue({ id: "session-1" });

      await controller.startVideoSession(req, res, next);

      expect(mockLsmService.startVideoSession).toHaveBeenCalledWith("video-1", {
        student_user_id: "student-h",
        start_at: undefined
      });
    });

    it("should fallback student_user_id to mock-student-id", async () => {
      const req = createMockRequest({
        params: { videoId: "video-1" },
        body: {}
      });
      const res = createMockResponse();
      const next = createMockNext();

      mockLsmService.startVideoSession.mockResolvedValue({ id: "session-1" });

      await controller.startVideoSession(req, res, next);

      expect(mockLsmService.startVideoSession).toHaveBeenCalledWith("video-1", {
        student_user_id: "mock-student-id",
        start_at: undefined
      });
    });
  });

  describe("finishVideoSession", () => {
    it("should finish video session successfully", async () => {
      const req = createMockRequest({
        params: { sessionId: "session-1" },
        body: {
          watched_seconds: 300,
          completion_rate: 0.8,
          is_completed: false
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "session-1", watched_seconds: 300 };

      mockLsmService.finishVideoSession.mockResolvedValue(result);

      await controller.finishVideoSession(req, res, next);

      expect(mockLsmService.finishVideoSession).toHaveBeenCalledWith("session-1", {
        watched_seconds: 300,
        completion_rate: 0.8,
        is_completed: false
      });
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Finish video session success")
      );
    });
  });

  describe("createQuizAttempt", () => {
    it("should create quiz attempt successfully", async () => {
      const req = createMockRequest({
        params: { quizId: "quiz-1" },
        headers: { "x-user-id": "student-1" },
        body: {
          answers: [{ question_id: "q1", selected_option_id: "o1" }]
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { attempt: { id: "attempt-1" }, answers: [] };

      mockLsmService.createQuizAttempt.mockResolvedValue(result);

      await controller.createQuizAttempt(req, res, next);

      expect(mockLsmService.createQuizAttempt).toHaveBeenCalledWith("quiz-1", {
        student_user_id: "student-1",
        started_at: undefined,
        submitted_at: undefined,
        answers: [{ question_id: "q1", selected_option_id: "o1" }]
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Create quiz attempt success")
      );
    });
  });

  describe("getQuizAttemptDetail", () => {
    it("should get quiz attempt detail successfully", async () => {
      const req = createMockRequest({
        params: { attemptId: "attempt-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "attempt-1", answers: [] };

      mockLsmService.getQuizAttemptDetail.mockResolvedValue(result);

      await controller.getQuizAttemptDetail(req, res, next);

      expect(mockLsmService.getQuizAttemptDetail).toHaveBeenCalledWith("attempt-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get quiz attempt detail success")
      );
    });
  });

  describe("createHomeworkSubmission", () => {
    it("should create homework submission successfully", async () => {
      const req = createMockRequest({
        params: { homeworkId: "homework-1" },
        headers: { "x-user-id": "student-1" },
        body: {
          submission_note: "done",
          zip_file_id: "zip-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "submission-1" };

      mockLsmService.createHomeworkSubmission.mockResolvedValue(result);

      await controller.createHomeworkSubmission(req, res, next);

      expect(mockLsmService.createHomeworkSubmission).toHaveBeenCalledWith("homework-1", {
        student_user_id: "student-1",
        submission_note: "done",
        zip_file_id: "zip-1"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Create homework submission success")
      );
    });
  });

  describe("listHomeworkSubmissions", () => {
    it("should list homework submissions successfully", async () => {
      const req = createMockRequest({
        params: { homeworkId: "homework-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "submission-1" }];

      mockLsmService.listHomeworkSubmissions.mockResolvedValue(result);

      await controller.listHomeworkSubmissions(req, res, next);

      expect(mockLsmService.listHomeworkSubmissions).toHaveBeenCalledWith("homework-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "List homework submissions success")
      );
    });
  });

  describe("getHomeworkSubmissionDetail", () => {
    it("should get homework submission detail successfully", async () => {
      const req = createMockRequest({
        params: { submissionId: "submission-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "submission-1" };

      mockLsmService.getHomeworkSubmissionDetail.mockResolvedValue(result);

      await controller.getHomeworkSubmissionDetail(req, res, next);

      expect(mockLsmService.getHomeworkSubmissionDetail).toHaveBeenCalledWith("submission-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get homework submission detail success")
      );
    });
  });

  describe("createClassworkResult", () => {
    it("should create classwork result successfully", async () => {
      const req = createMockRequest({
        params: { classworkId: "classwork-1" },
        body: {
          student_user_id: "student-1",
          score: 8,
          teacher_comment: "good"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "cw-result-1" };

      mockLsmService.createClassworkResult.mockResolvedValue(result);

      await controller.createClassworkResult(req, res, next);

      expect(mockLsmService.createClassworkResult).toHaveBeenCalledWith("classwork-1", {
        student_user_id: "student-1",
        score: 8,
        teacher_comment: "good"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Create classwork result success")
      );
    });
  });

  describe("createClassTestResult", () => {
    it("should create class test result successfully", async () => {
      const req = createMockRequest({
        params: { classTestId: "class-test-1" },
        body: {
          student_user_id: "student-1",
          score: 9
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "ct-result-1" };

      mockLsmService.createClassTestResult.mockResolvedValue(result);

      await controller.createClassTestResult(req, res, next);

      expect(mockLsmService.createClassTestResult).toHaveBeenCalledWith("class-test-1", {
        student_user_id: "student-1",
        score: 9
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Create class test result success")
      );
    });
  });

  describe("createPeriodicExamResult", () => {
    it("should create periodic exam result successfully", async () => {
      const req = createMockRequest({
        params: { examId: "exam-1" },
        body: {
          student_user_id: "student-1",
          score: 9.5,
          rank_in_exam: 2
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "exam-result-1" };

      mockLsmService.createPeriodicExamResult.mockResolvedValue(result);

      await controller.createPeriodicExamResult(req, res, next);

      expect(mockLsmService.createPeriodicExamResult).toHaveBeenCalledWith("exam-1", {
        student_user_id: "student-1",
        score: 9.5,
        rank_in_exam: 2
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Create periodic exam result success")
      );
    });
  });

  describe("getStudentWeekProgress", () => {
    it("should get student week progress successfully", async () => {
      const req = createMockRequest({
        params: {
          studentId: "student-1",
          weekId: "week-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { student_user_id: "student-1", course_week_id: "week-1" };

      mockLsmService.getStudentWeekProgress.mockResolvedValue(result);

      await controller.getStudentWeekProgress(req, res, next);

      expect(mockLsmService.getStudentWeekProgress).toHaveBeenCalledWith("student-1", "week-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get student week progress success")
      );
    });
  });

  describe("getLearningHistory", () => {
    it("should get learning history successfully", async () => {
      const req = createMockRequest({
        params: { studentId: "student-1" },
        query: {
          week_id: "week-1",
          page: "1",
          limit: "10"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = {
        video_sessions: [],
        quiz_attempts: [],
        homework_submissions: []
      };

      mockLsmService.getLearningHistory.mockResolvedValue(result);

      await controller.getLearningHistory(req, res, next);

      expect(mockLsmService.getLearningHistory).toHaveBeenCalledWith("student-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get learning history success")
      );
    });

    it("should call next when query invalid", async () => {
      const req = createMockRequest({
        params: { studentId: "student-1" },
        query: {
          page: 1
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getLearningHistory(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});