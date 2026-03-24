import { Router } from "express";
import { PltController } from "../controllers/plt.controller";

const pltController = new PltController();

export const pltRoutes = Router();

pltRoutes.get("/health", (req, res) => {
  res.json({
    module: "plt",
    ok: true
  });
});

pltRoutes.post(
  "/notifications",
  pltController.sendNotification.bind(pltController)
);

pltRoutes.get(
  "/users/:userId/notifications",
  pltController.getUserNotifications.bind(pltController)
);

pltRoutes.put(
  "/notifications/:notificationId/read",
  pltController.markAsRead.bind(pltController)
);

pltRoutes.post(
  "/files/upload",
  pltController.uploadFile.bind(pltController)
);