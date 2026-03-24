"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lsmRoutes = void 0;
const express_1 = require("express");
const lsm_controller_1 = require("../controllers/lsm.controller");
const lsmController = new lsm_controller_1.LsmController();
exports.lsmRoutes = (0, express_1.Router)();
exports.lsmRoutes.get("/health", (req, res) => {
    res.json({
        module: "lsm",
        ok: true
    });
});
exports.lsmRoutes.post("/lesson-videos/:videoId/sessions/start", lsmController.startVideoSession.bind(lsmController));
exports.lsmRoutes.post("/video-learning-sessions/:sessionId/finish", lsmController.finishVideoSession.bind(lsmController));
exports.lsmRoutes.post("/quizzes/:quizId/attempts", lsmController.createQuizAttempt.bind(lsmController));
exports.lsmRoutes.get("/quiz-attempts/:attemptId", lsmController.getQuizAttemptDetail.bind(lsmController));
exports.lsmRoutes.post("/homeworks/:homeworkId/submissions", lsmController.createHomeworkSubmission.bind(lsmController));
exports.lsmRoutes.get("/homeworks/:homeworkId/submissions", lsmController.listHomeworkSubmissions.bind(lsmController));
exports.lsmRoutes.get("/homework-submissions/:submissionId", lsmController.getHomeworkSubmissionDetail.bind(lsmController));
exports.lsmRoutes.post("/classworks/:classworkId/results", lsmController.createClassworkResult.bind(lsmController));
exports.lsmRoutes.post("/class-tests/:classTestId/results", lsmController.createClassTestResult.bind(lsmController));
exports.lsmRoutes.post("/periodic-exams/:examId/results", lsmController.createPeriodicExamResult.bind(lsmController));
exports.lsmRoutes.get("/students/:studentId/weeks/:weekId/progress", lsmController.getStudentWeekProgress.bind(lsmController));
exports.lsmRoutes.get("/students/:studentId/learning-history", lsmController.getLearningHistory.bind(lsmController));
