"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tewRoutes = void 0;
const express_1 = require("express");
const tew_controller_1 = require("../controllers/tew.controller");
const tewController = new tew_controller_1.TewController();
exports.tewRoutes = (0, express_1.Router)();
exports.tewRoutes.get("/health", (req, res) => {
    res.json({
        module: "tew",
        ok: true
    });
});
exports.tewRoutes.get("/teacher/students/:studentId/weeks/:weekId/review-workspace", tewController.getReviewWorkspace.bind(tewController));
exports.tewRoutes.post("/teacher/weekly-reviews", tewController.createWeeklyReview.bind(tewController));
exports.tewRoutes.put("/teacher/weekly-reviews/:reviewId", tewController.updateWeeklyReview.bind(tewController));
exports.tewRoutes.get("/weekly-reviews/:reviewId", tewController.getWeeklyReviewDetail.bind(tewController));
exports.tewRoutes.get("/teacher/assigned-tasks", tewController.listTeacherAssignedTasks.bind(tewController));
exports.tewRoutes.post("/teacher/assigned-tasks", tewController.createTeacherAssignedTask.bind(tewController));
exports.tewRoutes.post("/teacher/student-homework-overrides", tewController.createStudentHomeworkOverride.bind(tewController));
exports.tewRoutes.post("/teacher/offline-activity-records", tewController.createOfflineActivityRecord.bind(tewController));
