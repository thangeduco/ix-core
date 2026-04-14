import { Router } from "express";
import { VideoTrackingController } from "../controllers/video-tracking.controller";

const r = Router();
const c = new VideoTrackingController();

r.post("/video-sessions/start", c.start.bind(c));
r.post("/video-sessions/heartbeat", c.heartbeat.bind(c));
r.post("/video-sessions/pause", c.pause.bind(c));
r.post("/video-sessions/resume", c.resume.bind(c));
r.post("/video-sessions/seek", c.seek.bind(c));
r.post("/video-sessions/end", c.end.bind(c));

r.post("/video-quiz-events/open", c.openEvent.bind(c));
r.post("/video-quiz-events/close", c.closeEvent.bind(c));
r.post("/video-quiz-events/answer", c.answer.bind(c));
r.post("/video-quiz-events/submit", c.submit.bind(c));

export const videoTrackingRoutes = r;