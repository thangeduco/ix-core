"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pseRoutes = void 0;
const express_1 = require("express");
const pse_controller_1 = require("../controllers/pse.controller");
const controller = new pse_controller_1.PseController();
exports.pseRoutes = (0, express_1.Router)();
exports.pseRoutes.get("/health", (req, res) => {
    res.json({ module: "pse", ok: true });
});
exports.pseRoutes.get("/weekly-tasks", controller.getWeeklyTasks.bind(controller));
exports.pseRoutes.get("/weekly-summary", controller.getWeeklySummary.bind(controller));
exports.pseRoutes.get("/students/:studentId/ranking", controller.getStudentRanking.bind(controller));
exports.pseRoutes.get("/students/:studentId/groups", controller.getStudentGroups.bind(controller));
exports.pseRoutes.post("/parent-tasks", controller.createParentTask.bind(controller));
exports.pseRoutes.put("/parent-tasks/:taskId", controller.updateParentTask.bind(controller));
exports.pseRoutes.get("/parents/:parentId/tasks", controller.getParentTasks.bind(controller));
