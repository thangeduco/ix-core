import { Router } from "express";
import { TewController } from "../controllers/tew.controller";

const tewController = new TewController();

export const tewRoutes = Router();

tewRoutes.get("/health", (req, res) => {
  res.json({
    module: "tew",
    ok: true
  });
});

tewRoutes.get(
  "/teacher/students/:studentId/weeks/:weekId/review-workspace",
  tewController.getReviewWorkspace.bind(tewController)
);

tewRoutes.post(
  "/teacher/weekly-reviews",
  tewController.createWeeklyReview.bind(tewController)
);

tewRoutes.put(
  "/teacher/weekly-reviews/:reviewId",
  tewController.updateWeeklyReview.bind(tewController)
);

tewRoutes.get(
  "/weekly-reviews/:reviewId",
  tewController.getWeeklyReviewDetail.bind(tewController)
);

tewRoutes.get(
  "/teacher/assigned-tasks",
  tewController.listTeacherAssignedTasks.bind(tewController)
);

tewRoutes.post(
  "/teacher/assigned-tasks",
  tewController.createTeacherAssignedTask.bind(tewController)
);

tewRoutes.post(
  "/teacher/student-homework-overrides",
  tewController.createStudentHomeworkOverride.bind(tewController)
);

tewRoutes.post(
  "/teacher/offline-activity-records",
  tewController.createOfflineActivityRecord.bind(tewController)
);
