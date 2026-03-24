import { ok } from "../../../src/shared/utils/response";

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

import { CccController } from "../../../src/modules/ccc/controllers/ccc.controller";

describe("CccController unit test", () => {
  let controller: CccController;

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
    controller = new CccController();
  });

  describe("listCourses", () => {
    it("should list courses successfully", async () => {
      const req = createMockRequest({
        query: {
          subject: "math",
          page: "1",
          limit: "10"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "course-1" }];

      mockCccService.listCourses.mockResolvedValue(result);

      await controller.listCourses(req, res, next);

      expect(mockCccService.listCourses).toHaveBeenCalledWith({
        subject: "math",
        page: "1",
        limit: "10"
      });
      expect(res.json).toHaveBeenCalledWith(ok(result, "List courses success"));
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next when query invalid", async () => {
      const req = createMockRequest({
        query: {
          page: 1
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.listCourses(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("createCourse", () => {
    it("should create course successfully with x-user-id", async () => {
      const req = createMockRequest({
        headers: {
          "x-user-id": "admin-1"
        },
        body: {
          code: "MATH7",
          name: "Toan 7",
          subject: "math",
          grade_level: "7",
          course_type: "core"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "course-1" };

      mockCccService.createCourse.mockResolvedValue(result);

      await controller.createCourse(req, res, next);

      expect(mockCccService.createCourse).toHaveBeenCalledWith({
        code: "MATH7",
        name: "Toan 7",
        subject: "math",
        grade_level: "7",
        course_type: "core",
        created_by: "admin-1"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ok(result, "Create course success"));
    });

    it("should fallback created_by to mock-admin-id", async () => {
      const req = createMockRequest({
        body: {
          code: "MATH7",
          name: "Toan 7",
          subject: "math",
          grade_level: "7",
          course_type: "core"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "course-1" };

      mockCccService.createCourse.mockResolvedValue(result);

      await controller.createCourse(req, res, next);

      expect(mockCccService.createCourse).toHaveBeenCalledWith({
        code: "MATH7",
        name: "Toan 7",
        subject: "math",
        grade_level: "7",
        course_type: "core",
        created_by: "mock-admin-id"
      });
    });
  });

  describe("getCourseDetail", () => {
    it("should get course detail successfully", async () => {
      const req = createMockRequest({
        params: {
          courseId: "course-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "course-1" };

      mockCccService.getCourseDetail.mockResolvedValue(result);

      await controller.getCourseDetail(req, res, next);

      expect(mockCccService.getCourseDetail).toHaveBeenCalledWith("course-1");
      expect(res.json).toHaveBeenCalledWith(ok(result, "Get course detail success"));
    });

    it("should call next when courseId missing", async () => {
      const req = createMockRequest({
        params: {}
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getCourseDetail(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("updateCourse", () => {
    it("should update course successfully", async () => {
      const req = createMockRequest({
        params: { courseId: "course-1" },
        body: { name: "Toan 7 new" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "course-1", name: "Toan 7 new" };

      mockCccService.updateCourse.mockResolvedValue(result);

      await controller.updateCourse(req, res, next);

      expect(mockCccService.updateCourse).toHaveBeenCalledWith("course-1", {
        name: "Toan 7 new"
      });
      expect(res.json).toHaveBeenCalledWith(ok(result, "Update course success"));
    });
  });

  describe("listCourseWeeks", () => {
    it("should list course weeks successfully", async () => {
      const req = createMockRequest({
        params: { courseId: "course-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "week-1" }];

      mockCccService.listCourseWeeks.mockResolvedValue(result);

      await controller.listCourseWeeks(req, res, next);

      expect(mockCccService.listCourseWeeks).toHaveBeenCalledWith("course-1");
      expect(res.json).toHaveBeenCalledWith(ok(result, "List course weeks success"));
    });
  });

  describe("createCourseWeek", () => {
    it("should create course week successfully", async () => {
      const req = createMockRequest({
        params: { courseId: "course-1" },
        body: {
          week_no: 1,
          title: "Week 1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "week-1" };

      mockCccService.createCourseWeek.mockResolvedValue(result);

      await controller.createCourseWeek(req, res, next);

      expect(mockCccService.createCourseWeek).toHaveBeenCalledWith("course-1", {
        week_no: 1,
        title: "Week 1"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ok(result, "Create course week success"));
    });
  });

  describe("getWeekDetail", () => {
    it("should get week detail successfully", async () => {
      const req = createMockRequest({
        params: { weekId: "week-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { week: { id: "week-1" }, lessons: [], quizzes: [], homeworks: [] };

      mockCccService.getWeekDetail.mockResolvedValue(result);

      await controller.getWeekDetail(req, res, next);

      expect(mockCccService.getWeekDetail).toHaveBeenCalledWith("week-1");
      expect(res.json).toHaveBeenCalledWith(ok(result, "Get week detail success"));
    });
  });

  describe("createLesson", () => {
    it("should create lesson successfully", async () => {
      const req = createMockRequest({
        params: { weekId: "week-1" },
        body: {
          title: "Lesson 1",
          lesson_type: "video",
          display_order: 1
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "lesson-1" };

      mockCccService.createLesson.mockResolvedValue(result);

      await controller.createLesson(req, res, next);

      expect(mockCccService.createLesson).toHaveBeenCalledWith("week-1", {
        title: "Lesson 1",
        lesson_type: "video",
        display_order: 1
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ok(result, "Create lesson success"));
    });
  });

  describe("getLessonDetail", () => {
    it("should get lesson detail successfully", async () => {
      const req = createMockRequest({
        params: { lessonId: "lesson-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "lesson-1" };

      mockCccService.getLessonDetail.mockResolvedValue(result);

      await controller.getLessonDetail(req, res, next);

      expect(mockCccService.getLessonDetail).toHaveBeenCalledWith("lesson-1");
      expect(res.json).toHaveBeenCalledWith(ok(result, "Get lesson detail success"));
    });
  });

  describe("createQuiz", () => {
    it("should create quiz successfully", async () => {
      const req = createMockRequest({
        params: { weekId: "week-1" },
        body: {
          title: "Quiz 1",
          quiz_type: "weekly_quiz"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "quiz-1" };

      mockCccService.createQuiz.mockResolvedValue(result);

      await controller.createQuiz(req, res, next);

      expect(mockCccService.createQuiz).toHaveBeenCalledWith("week-1", {
        title: "Quiz 1",
        quiz_type: "weekly_quiz"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ok(result, "Create quiz success"));
    });
  });

  describe("getQuizDetail", () => {
    it("should get quiz detail successfully", async () => {
      const req = createMockRequest({
        params: { quizId: "quiz-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "quiz-1" };

      mockCccService.getQuizDetail.mockResolvedValue(result);

      await controller.getQuizDetail(req, res, next);

      expect(mockCccService.getQuizDetail).toHaveBeenCalledWith("quiz-1");
      expect(res.json).toHaveBeenCalledWith(ok(result, "Get quiz detail success"));
    });
  });

  describe("listHomeworks", () => {
    it("should list homeworks successfully", async () => {
      const req = createMockRequest({
        params: { weekId: "week-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [{ id: "hw-1" }];

      mockCccService.listHomeworks.mockResolvedValue(result);

      await controller.listHomeworks(req, res, next);

      expect(mockCccService.listHomeworks).toHaveBeenCalledWith("week-1");
      expect(res.json).toHaveBeenCalledWith(ok(result, "List homeworks success"));
    });
  });

  describe("createHomework", () => {
    it("should create homework successfully", async () => {
      const req = createMockRequest({
        params: { weekId: "week-1" },
        body: {
          title: "Homework 1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = { id: "hw-1" };

      mockCccService.createHomework.mockResolvedValue(result);

      await controller.createHomework(req, res, next);

      expect(mockCccService.createHomework).toHaveBeenCalledWith("week-1", {
        title: "Homework 1"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ok(result, "Create homework success"));
    });
  });
});