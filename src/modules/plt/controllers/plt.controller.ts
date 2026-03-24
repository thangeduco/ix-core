import { Request, Response, NextFunction } from "express";
import { ok } from "../../../shared/utils/response";
import { PltService } from "../services/plt.service";
import {
  sendNotificationDto,
  uploadFileDto
} from "../dtos/plt.dto";

const pltService = new PltService();

const getParam = (value: string | string[] | undefined, name: string): string => {
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

export class PltController {
  async sendNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = sendNotificationDto.parse(req.body);
      const result = await pltService.sendNotification(payload);
      res.status(201).json(ok(result, "Send notification success"));
    } catch (error) {
      next(error);
    }
  }

  async getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getParam(req.params.userId, "userId");
      const result = await pltService.getUserNotifications(userId);
      res.json(ok(result, "Get user notifications success"));
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notificationId = getParam(req.params.notificationId, "notificationId");
      const result = await pltService.markNotificationRead(notificationId);
      res.json(ok(result, "Mark notification as read success"));
    } catch (error) {
      next(error);
    }
  }

  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = uploadFileDto.parse(req.body);
      const result = await pltService.uploadFile(payload);
      res.status(201).json(ok(result, "Upload file success"));
    } catch (error) {
      next(error);
    }
  }
}