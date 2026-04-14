import { Router } from "express";
import { IamController } from "../controllers/iam.controller";
import { avatarUploadMiddleware } from "../services/avatar-upload.middleware";
import { iamAuthMiddleware } from "../services/iam-auth.middleware";

const iamController = new IamController();

export const iamRoutes = Router();

iamRoutes.get("/health", (_req, res) => {
  res.json({
    module: "iam",
    ok: true
  });
});

iamRoutes.post(
  "/auth/register",
  avatarUploadMiddleware.single("avatar_file"),
  iamController.register.bind(iamController)
);

iamRoutes.post("/auth/login", iamController.login.bind(iamController));

iamRoutes.post(
  "/auth/password-reset/request",
  iamController.requestPasswordReset.bind(iamController)
);

iamRoutes.post(
  "/auth/password-reset/verify",
  iamController.verifyPasswordResetOtp.bind(iamController)
);

iamRoutes.post(
  "/auth/password-reset/confirm",
  iamController.confirmPasswordReset.bind(iamController)
);

iamRoutes.post(
  "/auth/logout",
  iamAuthMiddleware,
  iamController.logout.bind(iamController)
);

iamRoutes.post(
  "/auth/logout-all",
  iamAuthMiddleware,
  iamController.logoutAll.bind(iamController)
);

iamRoutes.get(
  "/auth/sessions",
  iamAuthMiddleware,
  iamController.getMySessions.bind(iamController)
);

iamRoutes.delete(
  "/auth/sessions/:session_id",
  iamAuthMiddleware,
  iamController.revokeSession.bind(iamController)
);

iamRoutes.get("/me", iamAuthMiddleware, iamController.getMe.bind(iamController));

iamRoutes.put(
  "/me/profile",
  iamAuthMiddleware,
  iamController.updateProfile.bind(iamController)
);