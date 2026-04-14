import { NextFunction, Request, Response } from "express";
import { ok } from "../../../shared/utils/response";
import { LsmService } from "../services/lsm.service";
import {
  classIdParamsDto,
  recentQueryDto,
  studentClassParamsDto,
  studentClassWeekParamsDto,
  studentIdParamsDto,
  studentTaskContentParamsDto
} from "../dtos/lsm.dto";

const service = new LsmService();

export class LsmController {
  async getStudentCoursesWithPendingWeeks(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { studentId } = studentIdParamsDto.parse(req.params);
      const result = await service.getStudentCoursesWithPendingWeeks(studentId);
      res.json(ok(result));
    } catch (error) {
      next(error);
    }
  }

  async getRecentStudentEvents(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { studentId } = studentIdParamsDto.parse(req.params);
      const { limit } = recentQueryDto.parse(req.query);
      const result = await service.getRecentStudentEvents(studentId, limit);
      res.json(ok(result));
    } catch (error) {
      next(error);
    }
  }

  async getRecentClassEvents(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { classId } = classIdParamsDto.parse(req.params);
      const { limit } = recentQueryDto.parse(req.query);
      const result = await service.getRecentClassEvents(classId, limit);
      res.json(ok(result));
    } catch (error) {
      next(error);
    }
  }

  async getStudentWeeklyTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { studentId, classCode, weekNo } = studentClassWeekParamsDto.parse(
        req.params
      );
      const result = await service.getStudentWeeklyTasks(
        studentId,
        classCode,
        weekNo
      );
      res.json(ok(result));
    } catch (error) {
      next(error);
    }
  }

  async getWeekProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, classCode, weekNo } = studentClassWeekParamsDto.parse(
        req.params
      );
      const result = await service.getWeekProgress(
        studentId,
        classCode,
        weekNo
      );
      res.json(ok(result));
    } catch (error) {
      next(error);
    }
  }

  async getPreviousWeekResult(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { studentId, classCode } = studentClassParamsDto.parse(req.params);
      const result = await service.getPreviousWeekResult(studentId, classCode);
      res.json(ok(result));
    } catch (error) {
      next(error);
    }
  }

  async getPreviousWeekResultByWeekNo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { studentId, classCode, weekNo } = studentClassWeekParamsDto.parse(
        req.params
      );
      const result = await service.getPreviousWeekResultByWeekNo(
        studentId,
        classCode,
        weekNo
      );
      res.json(ok(result));
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, classCode } = studentClassParamsDto.parse(req.params);
      const result = await service.getDashboard(studentId, classCode);
      res.json(ok(result));
    } catch (error) {
      next(error);
    }
  }

  async getDashboardByWeekNo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { studentId, classCode, weekNo } = studentClassWeekParamsDto.parse(
        req.params
      );
      const result = await service.getDashboardByWeekNo(
        studentId,
        classCode,
        weekNo
      );
      res.json(ok(result));
    } catch (error) {
      next(error);
    }
  }

  async getStudentTaskContent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { studentId, classCode, taskCode } =
        studentTaskContentParamsDto.parse(req.params);

      const result = await service.getStudentTaskContent(
        studentId,
        classCode,
        taskCode
      );

      res.json(ok(result));
    } catch (error) {
      next(error);
    }
  }
}