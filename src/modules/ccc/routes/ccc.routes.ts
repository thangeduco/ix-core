import { Router } from "express";
import { CccController } from "../controllers/ccc.controller";

const cccController = new CccController();

export const cccRoutes = Router();

cccRoutes.get("/health", (req, res) => {
  res.json({
    module: "ccc",
    ok: true
  });
});

cccRoutes.get("/courses", cccController.listCourses.bind(cccController));
cccRoutes.post("/courses", cccController.createCourse.bind(cccController));
cccRoutes.get("/courses/:courseId", cccController.getCourseDetail.bind(cccController));
cccRoutes.put("/courses/:courseId", cccController.updateCourse.bind(cccController));

cccRoutes.get("/courses/:courseId/weeks", cccController.listCourseWeeks.bind(cccController));
cccRoutes.post("/courses/:courseId/weeks", cccController.createCourseWeek.bind(cccController));

cccRoutes.get("/course-weeks/:weekId", cccController.getWeekDetail.bind(cccController));

cccRoutes.post("/course-weeks/:weekId/lessons", cccController.createLesson.bind(cccController));
cccRoutes.get("/lessons/:lessonId", cccController.getLessonDetail.bind(cccController));

cccRoutes.post("/course-weeks/:weekId/quizzes", cccController.createQuiz.bind(cccController));
cccRoutes.get("/quizzes/:quizId", cccController.getQuizDetail.bind(cccController));

cccRoutes.get("/course-weeks/:weekId/homeworks", cccController.listHomeworks.bind(cccController));
cccRoutes.post("/course-weeks/:weekId/homeworks", cccController.createHomework.bind(cccController));
