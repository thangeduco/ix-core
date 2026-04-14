import { Request, Response } from "express";
import { ok } from "../../../../shared/utils/response";
import { VideoSessionService } from "../services/video-session.service";
import { VideoEventService } from "../services/video-event.service";
import * as dto from "../dtos/video-tracking.dto";

const sessionService = new VideoSessionService();
const eventService = new VideoEventService();

export class VideoTrackingController {

  async start(req: Request, res: Response) {
    const body = dto.startSessionDto.parse(req.body);
    const result = await sessionService.start(body);
    res.json(ok(result));
  }

  async heartbeat(req: Request, res: Response) {
    const body = dto.heartbeatDto.parse(req.body);
    await sessionService.heartbeat(body.session_id, body.current_second);
    res.json(ok(true));
  }

  async pause(req: Request, res: Response) {
    const body = dto.pauseDto.parse(req.body);
    await sessionService.pause(body.session_id, body.current_second);
    res.json(ok(true));
  }

  async resume(req: Request, res: Response) {
    const body = dto.resumeDto.parse(req.body);
    await sessionService.resume(body.session_id);
    res.json(ok(true));
  }

  async seek(req: Request, res: Response) {
    const body = dto.seekDto.parse(req.body);
    await sessionService.seek(body.session_id, body.from_second, body.to_second);
    res.json(ok(true));
  }

  async end(req: Request, res: Response) {
    const body = dto.endDto.parse(req.body);
    await sessionService.end(body.session_id, body.end_second);
    res.json(ok(true));
  }

  async openEvent(req: Request, res: Response) {
    const body = dto.eventOpenDto.parse(req.body);
    const result = await eventService.openEvent(body);
    res.json(ok(result));
  }

  async closeEvent(req: Request, res: Response) {
    const body = dto.eventCloseDto.parse(req.body);
    await eventService.closeEvent(body);
    res.json(ok(true));
  }

  async answer(req: Request, res: Response) {
    const body = dto.eventAnswerDto.parse(req.body);
    await eventService.answer(body);
    res.json(ok(true));
  }

  async submit(req: Request, res: Response) {
    const body = dto.eventSubmitDto.parse(req.body);
    await eventService.submit(body);
    res.json(ok(true));
  }
}