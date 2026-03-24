"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PltService = void 0;
const crypto_1 = require("crypto");
const plt_repository_1 = require("../repositories/plt.repository");
class PltService {
    constructor() {
        this.pltRepository = new plt_repository_1.PltRepository();
    }
    async sendNotification(payload) {
        return this.pltRepository.createNotification({
            id: (0, crypto_1.randomUUID)(),
            user_id: payload.user_id,
            title: payload.title,
            message: payload.message,
            type: payload.type,
            is_read: false,
            created_at: new Date()
        });
    }
    async getUserNotifications(userId) {
        return this.pltRepository.findNotificationsByUserId(userId);
    }
    async markNotificationRead(notificationId) {
        const notification = await this.pltRepository.findNotificationById(notificationId);
        if (!notification) {
            throw new Error("Notification not found");
        }
        return this.pltRepository.markNotificationAsRead(notificationId);
    }
    async uploadFile(payload) {
        return this.pltRepository.createFileResource({
            id: (0, crypto_1.randomUUID)(),
            url: `https://mock-s3/${payload.file_name}`,
            file_name: payload.file_name,
            file_type: payload.file_type,
            uploaded_by: payload.uploaded_by,
            created_at: new Date()
        });
    }
}
exports.PltService = PltService;
