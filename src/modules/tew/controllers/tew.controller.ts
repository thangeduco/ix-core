import { Request, Response, NextFunction } from "express";
import { ok } from "../../../shared/utils/response";
import { TewService } from "../services/tew.service";
import {
  createOfflineActivityRecordDto,
  createStudentHomeworkOverrideDto,
  createTeacherAssignedTaskDto,
  createWeeklyReviewDto,
  teacherAssignedTaskListQueryDto,
  updateWeeklyReviewDto
} from "../dtos/tew.dto";

const tewService = new TewService();

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

export class TewController {
  async getReviewWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = getParam(req.params.studentId, "studentId");
      const weekId = getParam(req.params.weekId, "weekId");

      const result = await tewService.getReviewWorkspace(studentId, weekId);
      res.json(ok(result, "Get review workspace success"));
    } catch (error) {
      next(error);
    }
  }

  async createWeeklyReview(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createWeeklyReviewDto.parse(req.body);
      const teacherUserId = String(req.headers["x-user-id"] || "mock-teacher-id");

      const result = await tewService.createWeeklyReview({
        ...payload,
        teacher_user_id: teacherUserId
      });

      res.status(201).json(ok(result, "Create weekly review success"));
    } catch (error) {
      next(error);
    }
  }

  async updateWeeklyReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = getParam(req.params.reviewId, "reviewId");
      const payload = updateWeeklyReviewDto.parse(req.body);
      const result = await tewService.updateWeeklyReview(reviewId, payload);
      res.json(ok(result, "Update weekly review success"));
    } catch (error) {
      next(error);
    }
  }

  async getWeeklyReviewDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = getParam(req.params.reviewId, "reviewId");
      const result = await tewService.getWeeklyReviewDetail(reviewId);
      res.json(ok(result, "Get weekly review detail success"));
    } catch (error) {
      next(error);
    }
  }

  async createTeacherAssignedTask(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createTeacherAssignedTaskDto.parse(req.body);
      const result = await tewService.createTeacherAssignedTask(payload);
      res.status(201).json(ok(result, "Create teacher assigned task success"));
    } catch (error) {
      next(error);
    }
  }

  async listTeacherAssignedTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const query = teacherAssignedTaskListQueryDto.parse(req.query);
      const result = await tewService.listTeacherAssignedTasks(query);
      res.json(ok(result, "List teacher assigned tasks success"));
    } catch (error) {
      next(error);
    }
  }

  async createStudentHomeworkOverride(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createStudentHomeworkOverrideDto.parse(req.body);
      const teacherUserId = String(req.headers["x-user-id"] || "mock-teacher-id");

      const result = await tewService.createStudentHomeworkOverride({
        ...payload,
        created_by: teacherUserId
      });

      res.status(201).json(ok(result, "Create student homework override success"));
    } catch (error) {
      next(error);
    }
  }

  async createOfflineActivityRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createOfflineActivityRecordDto.parse(req.body);
      const teacherUserId = String(req.headers["x-user-id"] || "mock-teacher-id");

      const result = await tewService.createOfflineActivityRecord({
        ...payload,
        recorded_by: teacherUserId
      });

      res.status(201).json(ok(result, "Create offline activity record success"));
    } catch (error) {
      next(error);
    }
  }
}