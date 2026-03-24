import express from "express";
import request from "supertest";

const mockListCourses = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "listCourses" });
});

const mockCreateCourse = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createCourse" });
});

const mockGetCourseDetail = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getCourseDetail" });
});

const mockUpdateCourse = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "updateCourse" });
});

const mockListCourseWeeks = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "listCourseWeeks" });
});

const mockCreateCourseWeek = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createCourseWeek" });
});

const mockGetWeekDetail = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getWeekDetail" });
});

const mockCreateLesson = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createLesson" });
});

const mockGetLessonDetail = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getLessonDetail" });
});

const mockCreateQuiz = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createQuiz" });
});

const mockGetQuizDetail = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getQuizDetail" });
});

const mockListHomeworks = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "listHomeworks" });
});

const mockCreateHomework = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "createHomework" });
});

jest.mock("../../../src/modules/ccc/controllers/ccc.controller", () => {
  return {
    CccController: jest.fn().mockImplementation(() => ({
      listCourses: mockListCourses,
      createCourse: mockCreateCourse,
      getCourseDetail: mockGetCourseDetail,
      updateCourse: mockUpdateCourse,
      listCourseWeeks: mockListCourseWeeks,
      createCourseWeek: mockCreateCourseWeek,
      getWeekDetail: mockGetWeekDetail,
      createLesson: mockCreateLesson,
      getLessonDetail: mockGetLessonDetail,
      createQuiz: mockCreateQuiz,
      getQuizDetail: mockGetQuizDetail,
      listHomeworks: mockListHomeworks,
      createHomework: mockCreateHomework
    }))
  };
});

import { cccRoutes } from "../../../src/modules/ccc/routes/ccc.routes";

describe("ccc.routes smoke test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/ccc", cccRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /ccc/health should return health response", async () => {
    const res = await request(app).get("/ccc/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "ccc",
      ok: true
    });
  });

  it("GET /ccc/courses should call controller.listCourses", async () => {
    const res = await request(app).get("/ccc/courses");

    expect(res.status).toBe(200);
    expect(mockListCourses).toHaveBeenCalledTimes(1);
  });

  it("POST /ccc/courses should call controller.createCourse", async () => {
    const res = await request(app).post("/ccc/courses").send({
      code: "MATH7",
      name: "Toan 7",
      subject: "math",
      grade_level: "7",
      course_type: "core"
    });

    expect(res.status).toBe(201);
    expect(mockCreateCourse).toHaveBeenCalledTimes(1);
  });

  it("GET /ccc/courses/:courseId should call controller.getCourseDetail", async () => {
    const res = await request(app).get("/ccc/courses/course-1");

    expect(res.status).toBe(200);
    expect(mockGetCourseDetail).toHaveBeenCalledTimes(1);
  });

  it("PUT /ccc/courses/:courseId should call controller.updateCourse", async () => {
    const res = await request(app).put("/ccc/courses/course-1").send({
      name: "Toan 7 nang cao"
    });

    expect(res.status).toBe(200);
    expect(mockUpdateCourse).toHaveBeenCalledTimes(1);
  });

  it("GET /ccc/courses/:courseId/weeks should call controller.listCourseWeeks", async () => {
    const res = await request(app).get("/ccc/courses/course-1/weeks");

    expect(res.status).toBe(200);
    expect(mockListCourseWeeks).toHaveBeenCalledTimes(1);
  });

  it("POST /ccc/courses/:courseId/weeks should call controller.createCourseWeek", async () => {
    const res = await request(app).post("/ccc/courses/course-1/weeks").send({
      week_no: 1,
      title: "Week 1"
    });

    expect(res.status).toBe(201);
    expect(mockCreateCourseWeek).toHaveBeenCalledTimes(1);
  });

  it("GET /ccc/course-weeks/:weekId should call controller.getWeekDetail", async () => {
    const res = await request(app).get("/ccc/course-weeks/week-1");

    expect(res.status).toBe(200);
    expect(mockGetWeekDetail).toHaveBeenCalledTimes(1);
  });

  it("POST /ccc/course-weeks/:weekId/lessons should call controller.createLesson", async () => {
    const res = await request(app).post("/ccc/course-weeks/week-1/lessons").send({
      title: "Lesson 1",
      lesson_type: "video",
      display_order: 1
    });

    expect(res.status).toBe(201);
    expect(mockCreateLesson).toHaveBeenCalledTimes(1);
  });

  it("GET /ccc/lessons/:lessonId should call controller.getLessonDetail", async () => {
    const res = await request(app).get("/ccc/lessons/lesson-1");

    expect(res.status).toBe(200);
    expect(mockGetLessonDetail).toHaveBeenCalledTimes(1);
  });

  it("POST /ccc/course-weeks/:weekId/quizzes should call controller.createQuiz", async () => {
    const res = await request(app).post("/ccc/course-weeks/week-1/quizzes").send({
      title: "Quiz 1",
      quiz_type: "weekly_quiz"
    });

    expect(res.status).toBe(201);
    expect(mockCreateQuiz).toHaveBeenCalledTimes(1);
  });

  it("GET /ccc/quizzes/:quizId should call controller.getQuizDetail", async () => {
    const res = await request(app).get("/ccc/quizzes/quiz-1");

    expect(res.status).toBe(200);
    expect(mockGetQuizDetail).toHaveBeenCalledTimes(1);
  });

  it("GET /ccc/course-weeks/:weekId/homeworks should call controller.listHomeworks", async () => {
    const res = await request(app).get("/ccc/course-weeks/week-1/homeworks");

    expect(res.status).toBe(200);
    expect(mockListHomeworks).toHaveBeenCalledTimes(1);
  });

  it("POST /ccc/course-weeks/:weekId/homeworks should call controller.createHomework", async () => {
    const res = await request(app).post("/ccc/course-weeks/week-1/homeworks").send({
      title: "Homework 1"
    });

    expect(res.status).toBe(201);
    expect(mockCreateHomework).toHaveBeenCalledTimes(1);
  });
});