import express from "express";
import request from "supertest";

const mockStartVideoSession = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "startVideoSession" });
});

const mockFinishVideoSession = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "finishVideoSession" });
});

const mockCreateQuizAttempt = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createQuizAttempt" });
});

const mockGetQuizAttemptDetail = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getQuizAttemptDetail" });
});

const mockCreateHomeworkSubmission = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createHomeworkSubmission" });
});

const mockListHomeworkSubmissions = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "listHomeworkSubmissions" });
});

const mockGetHomeworkSubmissionDetail = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getHomeworkSubmissionDetail" });
});

const mockCreateClassworkResult = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createClassworkResult" });
});

const mockCreateClassTestResult = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createClassTestResult" });
});

const mockCreatePeriodicExamResult = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createPeriodicExamResult" });
});

const mockGetStudentWeekProgress = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getStudentWeekProgress" });
});

const mockGetLearningHistory = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getLearningHistory" });
});

jest.mock("../../../src/modules/lsm/controllers/lsm.controller", () => {
  return {
    LsmController: jest.fn().mockImplementation(() => ({
      startVideoSession: mockStartVideoSession,
      finishVideoSession: mockFinishVideoSession,
      createQuizAttempt: mockCreateQuizAttempt,
      getQuizAttemptDetail: mockGetQuizAttemptDetail,
      createHomeworkSubmission: mockCreateHomeworkSubmission,
      listHomeworkSubmissions: mockListHomeworkSubmissions,
      getHomeworkSubmissionDetail: mockGetHomeworkSubmissionDetail,
      createClassworkResult: mockCreateClassworkResult,
      createClassTestResult: mockCreateClassTestResult,
      createPeriodicExamResult: mockCreatePeriodicExamResult,
      getStudentWeekProgress: mockGetStudentWeekProgress,
      getLearningHistory: mockGetLearningHistory
    }))
  };
});

import { lsmRoutes } from "../../../src/modules/lsm/routes/lsm.routes";

describe("lsm.routes smoke test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/lsm", lsmRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /lsm/health should return health response", async () => {
    const res = await request(app).get("/lsm/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "lsm",
      ok: true
    });
  });

  it("POST /lsm/lesson-videos/:videoId/sessions/start should call controller.startVideoSession", async () => {
    const res = await request(app)
      .post("/lsm/lesson-videos/video-1/sessions/start")
      .send({ start_at: "2026-03-19T10:00:00Z" });

    expect(res.status).toBe(201);
    expect(mockStartVideoSession).toHaveBeenCalledTimes(1);
  });

  it("POST /lsm/video-learning-sessions/:sessionId/finish should call controller.finishVideoSession", async () => {
    const res = await request(app)
      .post("/lsm/video-learning-sessions/session-1/finish")
      .send({
        watched_seconds: 300,
        completion_rate: 0.8,
        is_completed: false
      });

    expect(res.status).toBe(200);
    expect(mockFinishVideoSession).toHaveBeenCalledTimes(1);
  });

  it("POST /lsm/quizzes/:quizId/attempts should call controller.createQuizAttempt", async () => {
    const res = await request(app)
      .post("/lsm/quizzes/quiz-1/attempts")
      .send({
        answers: [{ question_id: "q1", selected_option_id: "o1" }]
      });

    expect(res.status).toBe(201);
    expect(mockCreateQuizAttempt).toHaveBeenCalledTimes(1);
  });

  it("GET /lsm/quiz-attempts/:attemptId should call controller.getQuizAttemptDetail", async () => {
    const res = await request(app).get("/lsm/quiz-attempts/attempt-1");

    expect(res.status).toBe(200);
    expect(mockGetQuizAttemptDetail).toHaveBeenCalledTimes(1);
  });

  it("POST /lsm/homeworks/:homeworkId/submissions should call controller.createHomeworkSubmission", async () => {
    const res = await request(app)
      .post("/lsm/homeworks/homework-1/submissions")
      .send({ submission_note: "done" });

    expect(res.status).toBe(201);
    expect(mockCreateHomeworkSubmission).toHaveBeenCalledTimes(1);
  });

  it("GET /lsm/homeworks/:homeworkId/submissions should call controller.listHomeworkSubmissions", async () => {
    const res = await request(app).get("/lsm/homeworks/homework-1/submissions");

    expect(res.status).toBe(200);
    expect(mockListHomeworkSubmissions).toHaveBeenCalledTimes(1);
  });

  it("GET /lsm/homework-submissions/:submissionId should call controller.getHomeworkSubmissionDetail", async () => {
    const res = await request(app).get("/lsm/homework-submissions/sub-1");

    expect(res.status).toBe(200);
    expect(mockGetHomeworkSubmissionDetail).toHaveBeenCalledTimes(1);
  });

  it("POST /lsm/classworks/:classworkId/results should call controller.createClassworkResult", async () => {
    const res = await request(app)
      .post("/lsm/classworks/classwork-1/results")
      .send({ student_user_id: "student-1", score: 8 });

    expect(res.status).toBe(201);
    expect(mockCreateClassworkResult).toHaveBeenCalledTimes(1);
  });

  it("POST /lsm/class-tests/:classTestId/results should call controller.createClassTestResult", async () => {
    const res = await request(app)
      .post("/lsm/class-tests/class-test-1/results")
      .send({ student_user_id: "student-1", score: 9 });

    expect(res.status).toBe(201);
    expect(mockCreateClassTestResult).toHaveBeenCalledTimes(1);
  });

  it("POST /lsm/periodic-exams/:examId/results should call controller.createPeriodicExamResult", async () => {
    const res = await request(app)
      .post("/lsm/periodic-exams/exam-1/results")
      .send({ student_user_id: "student-1", score: 9.5 });

    expect(res.status).toBe(201);
    expect(mockCreatePeriodicExamResult).toHaveBeenCalledTimes(1);
  });

  it("GET /lsm/students/:studentId/weeks/:weekId/progress should call controller.getStudentWeekProgress", async () => {
    const res = await request(app).get("/lsm/students/student-1/weeks/week-1/progress");

    expect(res.status).toBe(200);
    expect(mockGetStudentWeekProgress).toHaveBeenCalledTimes(1);
  });

  it("GET /lsm/students/:studentId/learning-history should call controller.getLearningHistory", async () => {
    const res = await request(app).get("/lsm/students/student-1/learning-history");

    expect(res.status).toBe(200);
    expect(mockGetLearningHistory).toHaveBeenCalledTimes(1);
  });
});