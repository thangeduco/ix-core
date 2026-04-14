"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoEventService = void 0;
const video_event_repository_1 = require("../repositories/video-event.repository");
const video_event_log_repository_1 = require("../repositories/video-event-log.repository");
class VideoEventService {
    constructor() {
        this.repo = new video_event_repository_1.VideoEventRepository();
        this.logRepo = new video_event_log_repository_1.VideoEventLogRepository();
    }
    async openEvent(data) {
        const attempt = await this.repo.createAttempt(data);
        await this.logRepo.log({
            ...data,
            event_type: "QUIZ_OPEN",
            event_second: data.event_second,
            ref_event_type: "QUIZ",
            ref_event_id: data.video_quiz_event_id
        });
        return attempt;
    }
    async closeEvent(data) {
        await this.repo.closeAttempt(data.attempt_id);
        await this.logRepo.log({
            event_type: "QUIZ_CLOSE",
            event_second: data.event_second,
            ref_event_type: "QUIZ_ATTEMPT",
            ref_event_id: data.attempt_id
        });
    }
    async answer(data) {
        await this.repo.insertAnswer(data);
    }
    async submit(data) {
        await this.repo.submitAttempt(data);
    }
}
exports.VideoEventService = VideoEventService;
