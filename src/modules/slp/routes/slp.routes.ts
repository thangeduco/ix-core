import { Router } from "express";
import { SlpController } from "../controllers/slp.controller";

const controller = new SlpController();
export const slpRoutes = Router();

slpRoutes.get("/health", (req, res) => {
  res.json({ module: "slp", ok: true });
});

slpRoutes.post(
  "/rankings/calculate",
  controller.calculateRanking.bind(controller)
);

slpRoutes.get(
  "/rankings",
  controller.getRanking.bind(controller)
);

slpRoutes.get(
  "/rankings/compare",
  controller.compareRanking.bind(controller)
);
