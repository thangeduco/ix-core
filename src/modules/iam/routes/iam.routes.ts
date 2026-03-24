import { Router } from "express";
import { IamController } from "../controllers/iam.controller";
import { avatarUploadMiddleware } from "../services/avatar-upload.middleware";

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

iamRoutes.post("/auth/logout", iamController.logout.bind(iamController));
iamRoutes.post("/auth/logout-all", iamController.logoutAll.bind(iamController));

iamRoutes.get("/auth/sessions", iamController.getMySessions.bind(iamController));
iamRoutes.delete(
  "/auth/sessions/:session_id",
  iamController.revokeSession.bind(iamController)
);

iamRoutes.get("/me", iamController.getMe.bind(iamController));
iamRoutes.put("/me/profile", iamController.updateProfile.bind(iamController));