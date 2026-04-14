"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSessionService = void 0;
const video_session_repository_1 = require("../repositories/video-session.repository");
const video_event_log_repository_1 = require("../repositories/video-event-log.repository");
class VideoSessionService {
    constructor() {
        this.repo = new video_session_repository_1.VideoSessionRepository();
        this.logRepo = new video_event_log_repository_1.VideoEventLogRepository();
    }
    async start(data) {
        const session = await this.repo.createSession(data);
        await this.logRepo.log({
            ...data,
            session_id: session.id,
            event_type: "VIDEO_START",
            event_second: data.start_second
        });
        return session;
    }
    async heartbeat(sessionId, currentSecond) {
        await this.repo.updateSession(sessionId, {
            end_second: currentSecond,
            watched_duration_second: currentSecond
        });
    }
    async pause(sessionId, second) {
        await this.repo.updateSession(sessionId, {
            status: "PAUSED",
            end_second: second
        });
    }
    async resume(sessionId) {
        await this.repo.updateSession(sessionId, {
            status: "PLAYING"
        });
    }
    async seek(sessionId, from, to) {
        await this.repo.updateSession(sessionId, {
            end_second: to
        });
    }
    async end(sessionId, endSecond) {
        await this.repo.updateSession(sessionId, {
            status: "ENDED",
            ended_at: new Date(),
            end_second: endSecond
        });
    }
}
exports.VideoSessionService = VideoSessionService;
