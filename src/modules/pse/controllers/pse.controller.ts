import { Request, Response, NextFunction } from "express";
import { ok } from "../../../shared/utils/response";
import { PseService } from "../services/pse.service";
import {
  weeklyTaskQueryDto,
  parentTaskUpdateDto,
  createParentTaskDto
} from "../dtos/pse.dto";

const service = new PseService();

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

export class PseController {
  async getWeeklyTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const query = weeklyTaskQueryDto.parse(req.query);
      const result = await service.getWeeklyTasks(query.student_user_id, query.week_id);
      res.json(ok(result, "Get weekly tasks success"));
    } catch (e) {
      next(e);
    }
  }

  async getWeeklySummary(req: Request, res: Response, next: NextFunction) {
    try {
      const query = weeklyTaskQueryDto.parse(req.query);
      const result = await service.getWeeklySummary(query.student_user_id, query.week_id);
      res.json(ok(result, "Get weekly summary success"));
    } catch (e) {
      next(e);
    }
  }

  async getStudentRanking(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = getParam(req.params.studentId, "studentId");
      const result = await service.getStudentRanking(studentId);
      res.json(ok(result, "Get student ranking success"));
    } catch (e) {
      next(e);
    }
  }

  async getStudentGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = getParam(req.params.studentId, "studentId");
      const result = await service.getStudentGroups(studentId);
      res.json(ok(result, "Get student groups success"));
    } catch (e) {
      next(e);
    }
  }

  async createParentTask(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createParentTaskDto.parse(req.body);
      const result = await service.createParentTask(payload);
      res.status(201).json(ok(result, "Create parent task success"));
    } catch (e) {
      next(e);
    }
  }

  async updateParentTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = getParam(req.params.taskId, "taskId");
      const payload = parentTaskUpdateDto.parse(req.body);
      const result = await service.updateParentTask(taskId, payload.status);
      res.json(ok(result, "Update parent task success"));
    } catch (e) {
      next(e);
    }
  }

  async getParentTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const parentId = getParam(req.params.parentId, "parentId");
      const result = await service.getParentTasks(parentId);
      res.json(ok(result, "Get parent tasks success"));
    } catch (e) {
      next(e);
    }
  }
}