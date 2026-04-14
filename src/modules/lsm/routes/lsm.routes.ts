import { Router } from "express";
import { LsmController } from "../controllers/lsm.controller";
import { videoTrackingRoutes } from "../lsm-video-tracking/routes/video-tracking.routes";

const controller = new LsmController();
export const lsmRoutes = Router();

lsmRoutes.use("/", videoTrackingRoutes);

lsmRoutes.get("/health", (_req, res) => {
  res.json({ module: "lsm", ok: true });
});

lsmRoutes.get(
  "/students/:studentId/courses/pending-weeks",
  controller.getStudentCoursesWithPendingWeeks.bind(controller)
);

lsmRoutes.get(
  "/students/:studentId/events/recent",
  controller.getRecentStudentEvents.bind(controller)
);

lsmRoutes.get(
  "/classes/:classId/events/recent",
  controller.getRecentClassEvents.bind(controller)
);

lsmRoutes.get(
  "/students/:studentId/classes/:classCode/weeks/:weekNo/tasks",
  controller.getStudentWeeklyTasks.bind(controller)
);

lsmRoutes.get(
  "/students/:studentId/classes/:classCode/weeks/:weekNo/progress",
  controller.getWeekProgress.bind(controller)
);

lsmRoutes.get(
  "/students/:studentId/classes/:classCode/previous-week-result",
  controller.getPreviousWeekResult.bind(controller)
);

lsmRoutes.get(
  "/students/:studentId/classes/:classCode/weeks/:weekNo/previous-week-result",
  controller.getPreviousWeekResultByWeekNo.bind(controller)
);

lsmRoutes.get(
  "/students/:studentId/classes/:classCode/dashboard",
  controller.getDashboard.bind(controller)
);

lsmRoutes.get(
  "/students/:studentId/classes/:classCode/weeks/:weekNo/dashboard",
  controller.getDashboardByWeekNo.bind(controller)
);

lsmRoutes.get(
  "/students/:studentId/classes/:classCode/tasks/:taskCode",
  controller.getStudentTaskContent.bind(controller)
);