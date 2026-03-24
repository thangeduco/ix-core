"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pltRoutes = void 0;
const express_1 = require("express");
const plt_controller_1 = require("../controllers/plt.controller");
const pltController = new plt_controller_1.PltController();
exports.pltRoutes = (0, express_1.Router)();
exports.pltRoutes.get("/health", (req, res) => {
    res.json({
        module: "plt",
        ok: true
    });
});
exports.pltRoutes.post("/notifications", pltController.sendNotification.bind(pltController));
exports.pltRoutes.get("/users/:userId/notifications", pltController.getUserNotifications.bind(pltController));
exports.pltRoutes.put("/notifications/:notificationId/read", pltController.markAsRead.bind(pltController));
exports.pltRoutes.post("/files/upload", pltController.uploadFile.bind(pltController));
