import { Request, Response, NextFunction } from "express";
import { ok } from "../../../shared/utils/response";
import { CccService } from "../services/ccc.service";
import {
  courseListQueryDto,
  createCourseDto,
  createCourseWeekDto,
  createHomeworkDto,
  createLessonDto,
  createQuizDto,
  updateCourseDto
} from "../dtos/ccc.dto";

const cccService = new CccService();

const getParam = (value: string | string[] | undefined, name: string): string => {
  if (Array.isArray(value)) {
    if (!value[0]) {
      throw new Error(`Missing route param: ${name}`);
    }
    return value[0];
  }

  if (!value) {
    throw new Error(`Missing route param: ${name}`);
  }

  return value;
};

export class CccController {
  async listCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const query = courseListQueryDto.parse(req.query);
      const result = await cccService.listCourses(query);
      res.json(ok(result, "List courses success"));
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createCourseDto.parse(req.body);
      const createdBy = String(req.headers["x-user-id"] || "mock-admin-id");
      const result = await cccService.createCourse({
        ...payload,
        created_by: createdBy
      });

      res.status(201).json(ok(result, "Create course success"));
    } catch (error) {
      next(error);
    }
  }

  async getCourseDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = getParam(req.params.courseId, "courseId");
      const result = await cccService.getCourseDetail(courseId);
      res.json(ok(result, "Get course detail success"));
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = getParam(req.params.courseId, "courseId");
      const payload = updateCourseDto.parse(req.body);
      const result = await cccService.updateCourse(courseId, payload);
      res.json(ok(result, "Update course success"));
    } catch (error) {
      next(error);
    }
  }

  async listCourseWeeks(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = getParam(req.params.courseId, "courseId");
      const result = await cccService.listCourseWeeks(courseId);
      res.json(ok(result, "List course weeks success"));
    } catch (error) {
      next(error);
    }
  }

  async createCourseWeek(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = getParam(req.params.courseId, "courseId");
      const payload = createCourseWeekDto.parse(req.body);
      const result = await cccService.createCourseWeek(courseId, payload);
      res.status(201).json(ok(result, "Create course week success"));
    } catch (error) {
      next(error);
    }
  }

  async getWeekDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const weekId = getParam(req.params.weekId, "weekId");
      const result = await cccService.getWeekDetail(weekId);
      res.json(ok(result, "Get week detail success"));
    } catch (error) {
      next(error);
    }
  }

  async createLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const weekId = getParam(req.params.weekId, "weekId");
      const payload = createLessonDto.parse(req.body);
      const result = await cccService.createLesson(weekId, payload);
      res.status(201).json(ok(result, "Create lesson success"));
    } catch (error) {
      next(error);
    }
  }

  async getLessonDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const lessonId = getParam(req.params.lessonId, "lessonId");
      const result = await cccService.getLessonDetail(lessonId);
      res.json(ok(result, "Get lesson detail success"));
    } catch (error) {
      next(error);
    }
  }

  async createQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const weekId = getParam(req.params.weekId, "weekId");
      const payload = createQuizDto.parse(req.body);
      const result = await cccService.createQuiz(weekId, payload);
      res.status(201).json(ok(result, "Create quiz success"));
    } catch (error) {
      next(error);
    }
  }

  async getQuizDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = getParam(req.params.quizId, "quizId");
      const result = await cccService.getQuizDetail(quizId);
      res.json(ok(result, "Get quiz detail success"));
    } catch (error) {
      next(error);
    }
  }

  async listHomeworks(req: Request, res: Response, next: NextFunction) {
    try {
      const weekId = getParam(req.params.weekId, "weekId");
      const result = await cccService.listHomeworks(weekId);
      res.json(ok(result, "List homeworks success"));
    } catch (error) {
      next(error);
    }
  }

  async createHomework(req: Request, res: Response, next: NextFunction) {
    try {
      const weekId = getParam(req.params.weekId, "weekId");
      const payload = createHomeworkDto.parse(req.body);
      const result = await cccService.createHomework(weekId, payload);
      res.status(201).json(ok(result, "Create homework success"));
    } catch (error) {
      next(error);
    }
  }
}