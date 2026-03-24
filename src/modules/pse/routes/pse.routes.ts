import { Router } from "express";
import { PseController } from "../controllers/pse.controller";

const controller = new PseController();
export const pseRoutes = Router();

pseRoutes.get("/health", (req, res) => {
  res.json({ module: "pse", ok: true });
});

pseRoutes.get("/weekly-tasks", controller.getWeeklyTasks.bind(controller));
pseRoutes.get("/weekly-summary", controller.getWeeklySummary.bind(controller));

pseRoutes.get("/students/:studentId/ranking", controller.getStudentRanking.bind(controller));
pseRoutes.get("/students/:studentId/groups", controller.getStudentGroups.bind(controller));

pseRoutes.post("/parent-tasks", controller.createParentTask.bind(controller));
pseRoutes.put("/parent-tasks/:taskId", controller.updateParentTask.bind(controller));
pseRoutes.get("/parents/:parentId/tasks", controller.getParentTasks.bind(controller));
