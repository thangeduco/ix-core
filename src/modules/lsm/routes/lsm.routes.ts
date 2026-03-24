import { Router } from "express";
import { LsmController } from "../controllers/lsm.controller";

const lsmController = new LsmController();

export const lsmRoutes = Router();

lsmRoutes.get("/health", (req, res) => {
  res.json({
    module: "lsm",
    ok: true
  });
});

lsmRoutes.post(
  "/lesson-videos/:videoId/sessions/start",
  lsmController.startVideoSession.bind(lsmController)
);

lsmRoutes.post(
  "/video-learning-sessions/:sessionId/finish",
  lsmController.finishVideoSession.bind(lsmController)
);

lsmRoutes.post(
  "/quizzes/:quizId/attempts",
  lsmController.createQuizAttempt.bind(lsmController)
);

lsmRoutes.get(
  "/quiz-attempts/:attemptId",
  lsmController.getQuizAttemptDetail.bind(lsmController)
);

lsmRoutes.post(
  "/homeworks/:homeworkId/submissions",
  lsmController.createHomeworkSubmission.bind(lsmController)
);

lsmRoutes.get(
  "/homeworks/:homeworkId/submissions",
  lsmController.listHomeworkSubmissions.bind(lsmController)
);

lsmRoutes.get(
  "/homework-submissions/:submissionId",
  lsmController.getHomeworkSubmissionDetail.bind(lsmController)
);

lsmRoutes.post(
  "/classworks/:classworkId/results",
  lsmController.createClassworkResult.bind(lsmController)
);

lsmRoutes.post(
  "/class-tests/:classTestId/results",
  lsmController.createClassTestResult.bind(lsmController)
);

lsmRoutes.post(
  "/periodic-exams/:examId/results",
  lsmController.createPeriodicExamResult.bind(lsmController)
);

lsmRoutes.get(
  "/students/:studentId/weeks/:weekId/progress",
  lsmController.getStudentWeekProgress.bind(lsmController)
);

lsmRoutes.get(
  "/students/:studentId/learning-history",
  lsmController.getLearningHistory.bind(lsmController)
);
