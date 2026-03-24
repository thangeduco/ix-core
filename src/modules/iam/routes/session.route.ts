import { Router } from "express";
import { IamController } from "../controllers/iam.controller";

const router = Router();
const iamController = new IamController();

router.get("/sessions", (req, res, next) =>
  iamController.getMySessions(req, res, next)
);

router.delete("/sessions/:session_id", (req, res, next) =>
  iamController.revokeSession(req, res, next)
);

router.post("/sessions/logout-all", (req, res, next) =>
  iamController.logoutAll(req, res, next)
);

export default router;