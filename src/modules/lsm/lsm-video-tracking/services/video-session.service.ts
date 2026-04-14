import { VideoSessionRepository } from "../repositories/video-session.repository";
import { VideoEventLogRepository } from "../repositories/video-event-log.repository";

export class VideoSessionService {

  private repo = new VideoSessionRepository();
  private logRepo = new VideoEventLogRepository();

  async start(data: any) {
    const session = await this.repo.createSession(data);

    await this.logRepo.log({
      ...data,
      session_id: session.id,
      event_type: "VIDEO_START",
      event_second: data.start_second
    });

    return session;
  }

  async heartbeat(sessionId: number, currentSecond: number) {
    await this.repo.updateSession(sessionId, {
      end_second: currentSecond,
      watched_duration_second: currentSecond
    });
  }

  async pause(sessionId: number, second: number) {
    await this.repo.updateSession(sessionId, {
      status: "PAUSED",
      end_second: second
    });
  }

  async resume(sessionId: number) {
    await this.repo.updateSession(sessionId, {
      status: "PLAYING"
    });
  }

  async seek(sessionId: number, from: number, to: number) {
    await this.repo.updateSession(sessionId, {
      end_second: to
    });
  }

  async end(sessionId: number, endSecond: number) {
    await this.repo.updateSession(sessionId, {
      status: "ENDED",
      ended_at: new Date(),
      end_second: endSecond
    });
  }
}