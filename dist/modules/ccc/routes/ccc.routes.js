"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cccRoutes = void 0;
const express_1 = require("express");
const ccc_controller_1 = require("../controllers/ccc.controller");
const cccController = new ccc_controller_1.CccController();
exports.cccRoutes = (0, express_1.Router)();
exports.cccRoutes.get("/health", (req, res) => {
    res.json({
        module: "ccc",
        ok: true
    });
});
exports.cccRoutes.get("/courses", cccController.listCourses.bind(cccController));
exports.cccRoutes.post("/courses", cccController.createCourse.bind(cccController));
exports.cccRoutes.get("/courses/:courseId", cccController.getCourseDetail.bind(cccController));
exports.cccRoutes.put("/courses/:courseId", cccController.updateCourse.bind(cccController));
exports.cccRoutes.get("/courses/:courseId/weeks", cccController.listCourseWeeks.bind(cccController));
exports.cccRoutes.post("/courses/:courseId/weeks", cccController.createCourseWeek.bind(cccController));
exports.cccRoutes.get("/course-weeks/:weekId", cccController.getWeekDetail.bind(cccController));
exports.cccRoutes.post("/course-weeks/:weekId/lessons", cccController.createLesson.bind(cccController));
exports.cccRoutes.get("/lessons/:lessonId", cccController.getLessonDetail.bind(cccController));
exports.cccRoutes.post("/course-weeks/:weekId/quizzes", cccController.createQuiz.bind(cccController));
exports.cccRoutes.get("/quizzes/:quizId", cccController.getQuizDetail.bind(cccController));
exports.cccRoutes.get("/course-weeks/:weekId/homeworks", cccController.listHomeworks.bind(cccController));
exports.cccRoutes.post("/course-weeks/:weekId/homeworks", cccController.createHomework.bind(cccController));
