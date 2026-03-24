"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PltRepository = void 0;
class PltRepository {
    async createNotification(payload) {
        // TODO: integrate Postgres
        return payload;
    }
    async findNotificationsByUserId(userId) {
        // TODO: integrate Postgres
        return [];
    }
    async findNotificationById(notificationId) {
        // TODO: integrate Postgres
        return null;
    }
    async markNotificationAsRead(notificationId) {
        // TODO: integrate Postgres
        return {
            id: notificationId,
            is_read: true
        };
    }
    async createFileResource(payload) {
        // TODO: integrate Postgres
        return payload;
    }
}
exports.PltRepository = PltRepository;
