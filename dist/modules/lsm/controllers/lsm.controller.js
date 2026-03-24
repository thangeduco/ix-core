"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LsmController = void 0;
const response_1 = require("../../../shared/utils/response");
const lsm_service_1 = require("../services/lsm.service");
const lsm_dto_1 = require("../dtos/lsm.dto");
const lsmService = new lsm_service_1.LsmService();
const getParam = (value, name) => {
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
class LsmController {
    async startVideoSession(req, res, next) {
        try {
            const videoId = getParam(req.params.videoId, "videoId");
            const payload = lsm_dto_1.startVideoSessionDto.parse(req.body);
            const studentUserId = payload.student_user_id || String(req.headers["x-user-id"] || "mock-student-id");
            const result = await lsmService.startVideoSession(videoId, {
                student_user_id: studentUserId,
                start_at: payload.start_at
            });
            res.status(201).json((0, response_1.ok)(result, "Start video session success"));
        }
        catch (error) {
            next(error);
        }
    }
    async finishVideoSession(req, res, next) {
        try {
            const sessionId = getParam(req.params.sessionId, "sessionId");
            const payload = lsm_dto_1.finishVideoSessionDto.parse(req.body);
            const result = await lsmService.finishVideoSession(sessionId, payload);
            res.json((0, response_1.ok)(result, "Finish video session success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createQuizAttempt(req, res, next) {
        try {
            const quizId = getParam(req.params.quizId, "quizId");
            const payload = lsm_dto_1.createQuizAttemptDto.parse(req.body);
            const studentUserId = payload.student_user_id || String(req.headers["x-user-id"] || "mock-student-id");
            const result = await lsmService.createQuizAttempt(quizId, {
                student_user_id: studentUserId,
                started_at: payload.started_at,
                submitted_at: payload.submitted_at,
                answers: payload.answers
            });
            res.status(201).json((0, response_1.ok)(result, "Create quiz attempt success"));
        }
        catch (error) {
            next(error);
        }
    }
    async getQuizAttemptDetail(req, res, next) {
        try {
            const attemptId = getParam(req.params.attemptId, "attemptId");
            const result = await lsmService.getQuizAttemptDetail(attemptId);
            res.json((0, response_1.ok)(result, "Get quiz attempt detail success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createHomeworkSubmission(req, res, next) {
        try {
            const homeworkId = getParam(req.params.homeworkId, "homeworkId");
            const payload = lsm_dto_1.createHomeworkSubmissionDto.parse(req.body);
            const studentUserId = payload.student_user_id || String(req.headers["x-user-id"] || "mock-student-id");
            const result = await lsmService.createHomeworkSubmission(homeworkId, {
                student_user_id: studentUserId,
                submission_note: payload.submission_note,
                zip_file_id: payload.zip_file_id
            });
            res.status(201).json((0, response_1.ok)(result, "Create homework submission success"));
        }
        catch (error) {
            next(error);
        }
    }
    async listHomeworkSubmissions(req, res, next) {
        try {
            const homeworkId = getParam(req.params.homeworkId, "homeworkId");
            const result = await lsmService.listHomeworkSubmissions(homeworkId);
            res.json((0, response_1.ok)(result, "List homework submissions success"));
        }
        catch (error) {
            next(error);
        }
    }
    async getHomeworkSubmissionDetail(req, res, next) {
        try {
            const submissionId = getParam(req.params.submissionId, "submissionId");
            const result = await lsmService.getHomeworkSubmissionDetail(submissionId);
            res.json((0, response_1.ok)(result, "Get homework submission detail success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createClassworkResult(req, res, next) {
        try {
            const classworkId = getParam(req.params.classworkId, "classworkId");
            const payload = lsm_dto_1.createClassworkResultDto.parse(req.body);
            const result = await lsmService.createClassworkResult(classworkId, payload);
            res.status(201).json((0, response_1.ok)(result, "Create classwork result success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createClassTestResult(req, res, next) {
        try {
            const classTestId = getParam(req.params.classTestId, "classTestId");
            const payload = lsm_dto_1.createClassTestResultDto.parse(req.body);
            const result = await lsmService.createClassTestResult(classTestId, payload);
            res.status(201).json((0, response_1.ok)(result, "Create class test result success"));
        }
        catch (error) {
            next(error);
        }
    }
    async createPeriodicExamResult(req, res, next) {
        try {
            const examId = getParam(req.params.examId, "examId");
            const payload = lsm_dto_1.createPeriodicExamResultDto.parse(req.body);
            const result = await lsmService.createPeriodicExamResult(examId, payload);
            res.status(201).json((0, response_1.ok)(result, "Create periodic exam result success"));
        }
        catch (error) {
            next(error);
        }
    }
    async getStudentWeekProgress(req, res, next) {
        try {
            const studentId = getParam(req.params.studentId, "studentId");
            const weekId = getParam(req.params.weekId, "weekId");
            const result = await lsmService.getStudentWeekProgress(studentId, weekId);
            res.json((0, response_1.ok)(result, "Get student week progress success"));
        }
        catch (error) {
            next(error);
        }
    }
    async getLearningHistory(req, res, next) {
        try {
            const studentId = getParam(req.params.studentId, "studentId");
            lsm_dto_1.learningHistoryQueryDto.parse(req.query);
            const result = await lsmService.getLearningHistory(studentId);
            res.json((0, response_1.ok)(result, "Get learning history success"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LsmController = LsmController;
