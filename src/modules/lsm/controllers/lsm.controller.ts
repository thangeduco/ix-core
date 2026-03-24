import { Request, Response, NextFunction } from "express";
import { ok } from "../../../shared/utils/response";
import { LsmService } from "../services/lsm.service";
import {
  createClassTestResultDto,
  createClassworkResultDto,
  createHomeworkSubmissionDto,
  createPeriodicExamResultDto,
  createQuizAttemptDto,
  finishVideoSessionDto,
  learningHistoryQueryDto,
  startVideoSessionDto
} from "../dtos/lsm.dto";

const lsmService = new LsmService();

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

export class LsmController {
  async startVideoSession(req: Request, res: Response, next: NextFunction) {
    try {
      const videoId = getParam(req.params.videoId, "videoId");
      const payload = startVideoSessionDto.parse(req.body);
      const studentUserId =
        payload.student_user_id || String(req.headers["x-user-id"] || "mock-student-id");

      const result = await lsmService.startVideoSession(videoId, {
        student_user_id: studentUserId,
        start_at: payload.start_at
      });

      res.status(201).json(ok(result, "Start video session success"));
    } catch (error) {
      next(error);
    }
  }

  async finishVideoSession(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = getParam(req.params.sessionId, "sessionId");
      const payload = finishVideoSessionDto.parse(req.body);
      const result = await lsmService.finishVideoSession(sessionId, payload);
      res.json(ok(result, "Finish video session success"));
    } catch (error) {
      next(error);
    }
  }

  async createQuizAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = getParam(req.params.quizId, "quizId");
      const payload = createQuizAttemptDto.parse(req.body);
      const studentUserId =
        payload.student_user_id || String(req.headers["x-user-id"] || "mock-student-id");

      const result = await lsmService.createQuizAttempt(quizId, {
        student_user_id: studentUserId,
        started_at: payload.started_at,
        submitted_at: payload.submitted_at,
        answers: payload.answers
      });

      res.status(201).json(ok(result, "Create quiz attempt success"));
    } catch (error) {
      next(error);
    }
  }

  async getQuizAttemptDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const attemptId = getParam(req.params.attemptId, "attemptId");
      const result = await lsmService.getQuizAttemptDetail(attemptId);
      res.json(ok(result, "Get quiz attempt detail success"));
    } catch (error) {
      next(error);
    }
  }

  async createHomeworkSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const homeworkId = getParam(req.params.homeworkId, "homeworkId");
      const payload = createHomeworkSubmissionDto.parse(req.body);
      const studentUserId =
        payload.student_user_id || String(req.headers["x-user-id"] || "mock-student-id");

      const result = await lsmService.createHomeworkSubmission(homeworkId, {
        student_user_id: studentUserId,
        submission_note: payload.submission_note,
        zip_file_id: payload.zip_file_id
      });

      res.status(201).json(ok(result, "Create homework submission success"));
    } catch (error) {
      next(error);
    }
  }

  async listHomeworkSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const homeworkId = getParam(req.params.homeworkId, "homeworkId");
      const result = await lsmService.listHomeworkSubmissions(homeworkId);
      res.json(ok(result, "List homework submissions success"));
    } catch (error) {
      next(error);
    }
  }

  async getHomeworkSubmissionDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const submissionId = getParam(req.params.submissionId, "submissionId");
      const result = await lsmService.getHomeworkSubmissionDetail(submissionId);
      res.json(ok(result, "Get homework submission detail success"));
    } catch (error) {
      next(error);
    }
  }

  async createClassworkResult(req: Request, res: Response, next: NextFunction) {
    try {
      const classworkId = getParam(req.params.classworkId, "classworkId");
      const payload = createClassworkResultDto.parse(req.body);
      const result = await lsmService.createClassworkResult(classworkId, payload);
      res.status(201).json(ok(result, "Create classwork result success"));
    } catch (error) {
      next(error);
    }
  }

  async createClassTestResult(req: Request, res: Response, next: NextFunction) {
    try {
      const classTestId = getParam(req.params.classTestId, "classTestId");
      const payload = createClassTestResultDto.parse(req.body);
      const result = await lsmService.createClassTestResult(classTestId, payload);
      res.status(201).json(ok(result, "Create class test result success"));
    } catch (error) {
      next(error);
    }
  }

  async createPeriodicExamResult(req: Request, res: Response, next: NextFunction) {
    try {
      const examId = getParam(req.params.examId, "examId");
      const payload = createPeriodicExamResultDto.parse(req.body);
      const result = await lsmService.createPeriodicExamResult(examId, payload);
      res.status(201).json(ok(result, "Create periodic exam result success"));
    } catch (error) {
      next(error);
    }
  }

  async getStudentWeekProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = getParam(req.params.studentId, "studentId");
      const weekId = getParam(req.params.weekId, "weekId");
      const result = await lsmService.getStudentWeekProgress(studentId, weekId);
      res.json(ok(result, "Get student week progress success"));
    } catch (error) {
      next(error);
    }
  }

  async getLearningHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = getParam(req.params.studentId, "studentId");
      learningHistoryQueryDto.parse(req.query);
      const result = await lsmService.getLearningHistory(studentId);
      res.json(ok(result, "Get learning history success"));
    } catch (error) {
      next(error);
    }
  }
}