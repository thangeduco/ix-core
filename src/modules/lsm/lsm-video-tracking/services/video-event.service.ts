import { VideoEventRepository } from "../repositories/video-event.repository";
import { VideoEventLogRepository } from "../repositories/video-event-log.repository";

export class VideoEventService {

  private repo = new VideoEventRepository();
  private logRepo = new VideoEventLogRepository();

  async openEvent(data: any) {
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

  async closeEvent(data: any) {
    await this.repo.closeAttempt(data.attempt_id);

    await this.logRepo.log({
      event_type: "QUIZ_CLOSE",
      event_second: data.event_second,
      ref_event_type: "QUIZ_ATTEMPT",
      ref_event_id: data.attempt_id
    });
  }

  async answer(data: any) {
    await this.repo.insertAnswer(data);
  }

  async submit(data: any) {
    await this.repo.submitAttempt(data);
  }
}