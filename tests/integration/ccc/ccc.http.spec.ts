import express from "express";
import request from "supertest";

const mockCccService = {
  listCourses: jest.fn(),
  createCourse: jest.fn(),
  getCourseDetail: jest.fn(),
  updateCourse: jest.fn(),
  listCourseWeeks: jest.fn(),
  createCourseWeek: jest.fn(),
  getWeekDetail: jest.fn(),
  createLesson: jest.fn(),
  getLessonDetail: jest.fn(),
  createQuiz: jest.fn(),
  getQuizDetail: jest.fn(),
  listHomeworks: jest.fn(),
  createHomework: jest.fn()
};

jest.mock("../../../src/modules/ccc/services/ccc.service", () => {
  return {
    CccService: jest.fn().mockImplementation(() => mockCccService)
  };
});

import { cccRoutes } from "../../../src/modules/ccc/routes/ccc.routes";

describe("CCC HTTP-level test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/ccc", cccRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /ccc/health", async () => {
    const res = await request(app).get("/ccc/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "ccc",
      ok: true
    });
  });

  it("GET /ccc/courses should return course list", async () => {
    mockCccService.listCourses.mockResolvedValue([{ id: "course-1" }]);

    const res = await request(app).get("/ccc/courses").query({
      subject: "math",
      page: "1",
      limit: "10"
    });

    expect(res.status).toBe(200);
    expect(mockCccService.listCourses).toHaveBeenCalledWith({
      subject: "math",
      page: "1",
      limit: "10"
    });
    expect(res.body.data).toEqual([{ id: "course-1" }]);
  });

  it("POST /ccc/courses should create course", async () => {
    mockCccService.createCourse.mockResolvedValue({ id: "course-1" });

    const res = await request(app)
      .post("/ccc/courses")
      .set("x-user-id", "admin-1")
      .send({
        code: "MATH7",
        name: "Toan 7",
        subject: "math",
        grade_level: "7",
        course_type: "core"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("course-1");
  });

  it("GET /ccc/courses/:courseId should return course detail", async () => {
    mockCccService.getCourseDetail.mockResolvedValue({
      id: "course-1",
      weeks: []
    });

    const res = await request(app).get("/ccc/courses/course-1");

    expect(res.status).toBe(200);
    expect(mockCccService.getCourseDetail).toHaveBeenCalledWith("course-1");
    expect(res.body.data.id).toBe("course-1");
  });

  it("PUT /ccc/courses/:courseId should update course", async () => {
    mockCccService.updateCourse.mockResolvedValue({
      id: "course-1",
      name: "Toan 7 new"
    });

    const res = await request(app).put("/ccc/courses/course-1").send({
      name: "Toan 7 new"
    });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Toan 7 new");
  });

  it("GET /ccc/courses/:courseId/weeks should return weeks", async () => {
    mockCccService.listCourseWeeks.mockResolvedValue([{ id: "week-1" }]);

    const res = await request(app).get("/ccc/courses/course-1/weeks");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([{ id: "week-1" }]);
  });

  it("POST /ccc/courses/:courseId/weeks should create week", async () => {
    mockCccService.createCourseWeek.mockResolvedValue({ id: "week-1" });

    const res = await request(app).post("/ccc/courses/course-1/weeks").send({
      week_no: 1,
      title: "Week 1"
    });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("week-1");
  });

  it("GET /ccc/course-weeks/:weekId should return week detail", async () => {
    mockCccService.getWeekDetail.mockResolvedValue({
      week: { id: "week-1" },
      lessons: [],
      quizzes: [],
      homeworks: []
    });

    const res = await request(app).get("/ccc/course-weeks/week-1");

    expect(res.status).toBe(200);
    expect(res.body.data.week.id).toBe("week-1");
  });

  it("POST /ccc/course-weeks/:weekId/lessons should create lesson", async () => {
    mockCccService.createLesson.mockResolvedValue({ id: "lesson-1" });

    const res = await request(app).post("/ccc/course-weeks/week-1/lessons").send({
      title: "Lesson 1",
      lesson_type: "video",
      display_order: 1
    });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("lesson-1");
  });

  it("GET /ccc/lessons/:lessonId should return lesson detail", async () => {
    mockCccService.getLessonDetail.mockResolvedValue({ id: "lesson-1" });

    const res = await request(app).get("/ccc/lessons/lesson-1");

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe("lesson-1");
  });

  it("POST /ccc/course-weeks/:weekId/quizzes should create quiz", async () => {
    mockCccService.createQuiz.mockResolvedValue({ id: "quiz-1" });

    const res = await request(app).post("/ccc/course-weeks/week-1/quizzes").send({
      title: "Quiz 1",
      quiz_type: "weekly_quiz"
    });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("quiz-1");
  });

  it("GET /ccc/quizzes/:quizId should return quiz detail", async () => {
    mockCccService.getQuizDetail.mockResolvedValue({ id: "quiz-1" });

    const res = await request(app).get("/ccc/quizzes/quiz-1");

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe("quiz-1");
  });

  it("GET /ccc/course-weeks/:weekId/homeworks should return homeworks", async () => {
    mockCccService.listHomeworks.mockResolvedValue([{ id: "hw-1" }]);

    const res = await request(app).get("/ccc/course-weeks/week-1/homeworks");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([{ id: "hw-1" }]);
  });

  it("POST /ccc/course-weeks/:weekId/homeworks should create homework", async () => {
    mockCccService.createHomework.mockResolvedValue({ id: "hw-1" });

    const res = await request(app).post("/ccc/course-weeks/week-1/homeworks").send({
      title: "Homework 1"
    });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("hw-1");
  });

  it("POST /ccc/courses should return validation error when body invalid", async () => {
    const res = await request(app).post("/ccc/courses").send({
      code: "A"
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});