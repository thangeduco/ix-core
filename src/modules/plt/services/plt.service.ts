import { randomUUID } from "crypto";
import { PltRepository } from "../repositories/plt.repository";
import { SendNotificationDto, UploadFileDto } from "../dtos/plt.dto";

export class PltService {
  private readonly pltRepository = new PltRepository();

  async sendNotification(payload: SendNotificationDto) {
    return this.pltRepository.createNotification({
      id: randomUUID(),
      user_id: payload.user_id,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      is_read: false,
      created_at: new Date()
    });
  }

  async getUserNotifications(userId: string) {
    return this.pltRepository.findNotificationsByUserId(userId);
  }

  async markNotificationRead(notificationId: string) {
    const notification = await this.pltRepository.findNotificationById(notificationId);

    if (!notification) {
      throw new Error("Notification not found");
    }

    return this.pltRepository.markNotificationAsRead(notificationId);
  }

  async uploadFile(payload: UploadFileDto) {
    return this.pltRepository.createFileResource({
      id: randomUUID(),
      url: `https://mock-s3/${payload.file_name}`,
      file_name: payload.file_name,
      file_type: payload.file_type,
      uploaded_by: payload.uploaded_by,
      created_at: new Date()
    });
  }
}