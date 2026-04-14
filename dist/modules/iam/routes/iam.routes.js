"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iamRoutes = void 0;
const express_1 = require("express");
const iam_controller_1 = require("../controllers/iam.controller");
const avatar_upload_middleware_1 = require("../services/avatar-upload.middleware");
const iam_auth_middleware_1 = require("../services/iam-auth.middleware");
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
exports.iamRoutes.post("/auth/logout", iam_auth_middleware_1.iamAuthMiddleware, iamController.logout.bind(iamController));
exports.iamRoutes.post("/auth/logout-all", iam_auth_middleware_1.iamAuthMiddleware, iamController.logoutAll.bind(iamController));
exports.iamRoutes.get("/auth/sessions", iam_auth_middleware_1.iamAuthMiddleware, iamController.getMySessions.bind(iamController));
exports.iamRoutes.delete("/auth/sessions/:session_id", iam_auth_middleware_1.iamAuthMiddleware, iamController.revokeSession.bind(iamController));
exports.iamRoutes.get("/me", iam_auth_middleware_1.iamAuthMiddleware, iamController.getMe.bind(iamController));
exports.iamRoutes.put("/me/profile", iam_auth_middleware_1.iamAuthMiddleware, iamController.updateProfile.bind(iamController));
