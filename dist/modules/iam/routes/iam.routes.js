"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iamRoutes = void 0;
const express_1 = require("express");
const iam_controller_1 = require("../controllers/iam.controller");
const avatar_upload_middleware_1 = require("../services/avatar-upload.middleware");
const iamController = new iam_controller_1.IamController();
exports.iamRoutes = (0, express_1.Router)();
exports.iamRoutes.get("/health", (_req, res) => {
    res.json({
        module: "iam",
        ok: true
    });
});
exports.iamRoutes.post("/auth/register", avatar_upload_middleware_1.avatarUploadMiddleware.single("avatar_file"), iamController.register.bind(iamController));
exports.iamRoutes.post("/auth/login", iamController.login.bind(iamController));
exports.iamRoutes.post("/auth/password-reset/request", iamController.requestPasswordReset.bind(iamController));
exports.iamRoutes.post("/auth/password-reset/verify", iamController.verifyPasswordResetOtp.bind(iamController));
exports.iamRoutes.post("/auth/password-reset/confirm", iamController.confirmPasswordReset.bind(iamController));
exports.iamRoutes.post("/auth/logout", iamController.logout.bind(iamController));
exports.iamRoutes.post("/auth/logout-all", iamController.logoutAll.bind(iamController));
exports.iamRoutes.get("/auth/sessions", iamController.getMySessions.bind(iamController));
exports.iamRoutes.delete("/auth/sessions/:session_id", iamController.revokeSession.bind(iamController));
exports.iamRoutes.get("/me", iamController.getMe.bind(iamController));
exports.iamRoutes.put("/me/profile", iamController.updateProfile.bind(iamController));
