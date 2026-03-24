import { FileResource, Notification } from "../types/plt.types";

export class PltRepository {
  async createNotification(payload: Notification) {
    // TODO: integrate Postgres
    return payload;
  }

  async findNotificationsByUserId(userId: string) {
    // TODO: integrate Postgres
    return [] as Notification[];
  }

  async findNotificationById(notificationId: string) {
    // TODO: integrate Postgres
    return null as Notification | null;
  }

  async markNotificationAsRead(notificationId: string) {
    // TODO: integrate Postgres
    return {
      id: notificationId,
      is_read: true
    };
  }

  async createFileResource(payload: FileResource) {
    // TODO: integrate Postgres
    return payload;
  }
}