import express from "express";
import request from "supertest";

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

import { lsmRoutes } from "../../../src/modules/lsm/routes/lsm.routes";

describe("LSM HTTP-level test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/lsm", lsmRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /lsm/health", async () => {
    const res = await request(app).get("/lsm/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "lsm",
      ok: true
    });
  });

  it("POST /lsm/lesson-videos/:videoId/sessions/start should create session", async () => {
    mockLsmService.startVideoSession.mockResolvedValue({ id: "session-1" });

    const res = await request(app)
      .post("/lsm/lesson-videos/video-1/sessions/start")
      .set("x-user-id", "student-1")
      .send({ start_at: "2026-03-19T10:00:00Z" });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("session-1");
  });

  it("POST /lsm/video-learning-sessions/:sessionId/finish should finish session", async () => {
    mockLsmService.finishVideoSession.mockResolvedValue({ id: "session-1" });

    const res = await request(app)
      .post("/lsm/video-learning-sessions/session-1/finish")
      .send({
        watched_seconds: 300,
        completion_rate: 0.8,
        is_completed: false
      });

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe("session-1");
  });

  it("POST /lsm/quizzes/:quizId/attempts should create quiz attempt", async () => {
    mockLsmService.createQuizAttempt.mockResolvedValue({
      attempt: { id: "attempt-1" },
      answers: []
    });

    const res = await request(app)
      .post("/lsm/quizzes/quiz-1/attempts")
      .set("x-user-id", "student-1")
      .send({
        answers: [{ question_id: "q1", selected_option_id: "o1" }]
      });

    expect(res.status).toBe(201);
    expect(res.body.data.attempt.id).toBe("attempt-1");
  });

  it("GET /lsm/quiz-attempts/:attemptId should return attempt detail", async () => {
    mockLsmService.getQuizAttemptDetail.mockResolvedValue({
      id: "attempt-1",
      answers: []
    });

    const res = await request(app).get("/lsm/quiz-attempts/attempt-1");

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe("attempt-1");
  });

  it("POST /lsm/homeworks/:homeworkId/submissions should create homework submission", async () => {
    mockLsmService.createHomeworkSubmission.mockResolvedValue({ id: "submission-1" });

    const res = await request(app)
      .post("/lsm/homeworks/homework-1/submissions")
      .set("x-user-id", "student-1")
      .send({
        submission_note: "done",
        zip_file_id: "zip-1"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("submission-1");
  });

  it("GET /lsm/homeworks/:homeworkId/submissions should return homework submissions", async () => {
    mockLsmService.listHomeworkSubmissions.mockResolvedValue([{ id: "submission-1" }]);

    const res = await request(app).get("/lsm/homeworks/homework-1/submissions");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([{ id: "submission-1" }]);
  });

  it("GET /lsm/homework-submissions/:submissionId should return submission detail", async () => {
    mockLsmService.getHomeworkSubmissionDetail.mockResolvedValue({ id: "submission-1" });

    const res = await request(app).get("/lsm/homework-submissions/submission-1");

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe("submission-1");
  });

  it("POST /lsm/classworks/:classworkId/results should create classwork result", async () => {
    mockLsmService.createClassworkResult.mockResolvedValue({ id: "cw-result-1" });

    const res = await request(app)
      .post("/lsm/classworks/classwork-1/results")
      .send({
        student_user_id: "student-1",
        score: 8,
        teacher_comment: "good"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("cw-result-1");
  });

  it("POST /lsm/class-tests/:classTestId/results should create class test result", async () => {
    mockLsmService.createClassTestResult.mockResolvedValue({ id: "ct-result-1" });

    const res = await request(app)
      .post("/lsm/class-tests/class-test-1/results")
      .send({
        student_user_id: "student-1",
        score: 9
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("ct-result-1");
  });

  it("POST /lsm/periodic-exams/:examId/results should create periodic exam result", async () => {
    mockLsmService.createPeriodicExamResult.mockResolvedValue({ id: "exam-result-1" });

    const res = await request(app)
      .post("/lsm/periodic-exams/exam-1/results")
      .send({
        student_user_id: "student-1",
        score: 9.5,
        rank_in_exam: 2
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("exam-result-1");
  });

  it("GET /lsm/students/:studentId/weeks/:weekId/progress should return progress", async () => {
    mockLsmService.getStudentWeekProgress.mockResolvedValue({
      student_user_id: "student-1",
      course_week_id: "week-1"
    });

    const res = await request(app).get("/lsm/students/student-1/weeks/week-1/progress");

    expect(res.status).toBe(200);
    expect(res.body.data.student_user_id).toBe("student-1");
  });

  it("GET /lsm/students/:studentId/learning-history should return learning history", async () => {
    mockLsmService.getLearningHistory.mockResolvedValue({
      video_sessions: [],
      quiz_attempts: [],
      homework_submissions: []
    });

    const res = await request(app).get("/lsm/students/student-1/learning-history").query({
      page: "1",
      limit: "10"
    });

    expect(res.status).toBe(200);
    expect(res.body.data.video_sessions).toEqual([]);
  });

  it("POST /lsm/quizzes/:quizId/attempts should return validation error when body invalid", async () => {
    const res = await request(app)
      .post("/lsm/quizzes/quiz-1/attempts")
      .send({
        answers: []
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});