"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoTrackingController = void 0;
const response_1 = require("../../../../shared/utils/response");
const video_session_service_1 = require("../services/video-session.service");
const video_event_service_1 = require("../services/video-event.service");
const dto = __importStar(require("../dtos/video-tracking.dto"));
const sessionService = new video_session_service_1.VideoSessionService();
const eventService = new video_event_service_1.VideoEventService();
class VideoTrackingController {
    async start(req, res) {
        const body = dto.startSessionDto.parse(req.body);
        const result = await sessionService.start(body);
        res.json((0, response_1.ok)(result));
    }
    async heartbeat(req, res) {
        const body = dto.heartbeatDto.parse(req.body);
        await sessionService.heartbeat(body.session_id, body.current_second);
        res.json((0, response_1.ok)(true));
    }
    async pause(req, res) {
        const body = dto.pauseDto.parse(req.body);
        await sessionService.pause(body.session_id, body.current_second);
        res.json((0, response_1.ok)(true));
    }
    async resume(req, res) {
        const body = dto.resumeDto.parse(req.body);
        await sessionService.resume(body.session_id);
        res.json((0, response_1.ok)(true));
    }
    async seek(req, res) {
        const body = dto.seekDto.parse(req.body);
        await sessionService.seek(body.session_id, body.from_second, body.to_second);
        res.json((0, response_1.ok)(true));
    }
    async end(req, res) {
        const body = dto.endDto.parse(req.body);
        await sessionService.end(body.session_id, body.end_second);
        res.json((0, response_1.ok)(true));
    }
    async openEvent(req, res) {
        const body = dto.eventOpenDto.parse(req.body);
        const result = await eventService.openEvent(body);
        res.json((0, response_1.ok)(result));
    }
    async closeEvent(req, res) {
        const body = dto.eventCloseDto.parse(req.body);
        await eventService.closeEvent(body);
        res.json((0, response_1.ok)(true));
    }
    async answer(req, res) {
        const body = dto.eventAnswerDto.parse(req.body);
        await eventService.answer(body);
        res.json((0, response_1.ok)(true));
    }
    async submit(req, res) {
        const body = dto.eventSubmitDto.parse(req.body);
        await eventService.submit(body);
        res.json((0, response_1.ok)(true));
    }
}
exports.VideoTrackingController = VideoTrackingController;
