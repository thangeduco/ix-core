"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PltController = void 0;
const response_1 = require("../../../shared/utils/response");
const plt_service_1 = require("../services/plt.service");
const plt_dto_1 = require("../dtos/plt.dto");
const pltService = new plt_service_1.PltService();
const getParam = (value, name) => {
    if (Array.isArray(value)) {
        if (!value[0]) {
            throw new Error(`Missing route param: ${name}`);
        }
        return value[0];
    }
    if (!value) {
        throw new Error(`Missing route param: ${name}`);
    }
    return value;
};
class PltController {
    async sendNotification(req, res, next) {
        try {
            const payload = plt_dto_1.sendNotificationDto.parse(req.body);
            const result = await pltService.sendNotification(payload);
            res.status(201).json((0, response_1.ok)(result, "Send notification success"));
        }
        catch (error) {
            next(error);
        }
    }
    async getUserNotifications(req, res, next) {
        try {
            const userId = getParam(req.params.userId, "userId");
            const result = await pltService.getUserNotifications(userId);
            res.json((0, response_1.ok)(result, "Get user notifications success"));
        }
        catch (error) {
            next(error);
        }
    }
    async markAsRead(req, res, next) {
        try {
            const notificationId = getParam(req.params.notificationId, "notificationId");
            const result = await pltService.markNotificationRead(notificationId);
            res.json((0, response_1.ok)(result, "Mark notification as read success"));
        }
        catch (error) {
            next(error);
        }
    }
    async uploadFile(req, res, next) {
        try {
            const payload = plt_dto_1.uploadFileDto.parse(req.body);
            const result = await pltService.uploadFile(payload);
            res.status(201).json((0, response_1.ok)(result, "Upload file success"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PltController = PltController;
