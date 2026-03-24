"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlpController = void 0;
const response_1 = require("../../../shared/utils/response");
const slp_service_1 = require("../services/slp.service");
const slp_dto_1 = require("../dtos/slp.dto");
const service = new slp_service_1.SlpService();
class SlpController {
    async calculateRanking(req, res, next) {
        try {
            const payload = slp_dto_1.rankingQueryDto.parse(req.body);
            const result = await service.calculateRanking(payload);
            res.json((0, response_1.ok)(result, "Calculate ranking success"));
        }
        catch (e) {
            next(e);
        }
    }
    async getRanking(req, res, next) {
        try {
            const query = slp_dto_1.rankingQueryDto.parse(req.query);
            const result = await service.getRanking(query);
            res.json((0, response_1.ok)(result, "Get ranking success"));
        }
        catch (e) {
            next(e);
        }
    }
    async compareRanking(req, res, next) {
        try {
            const payload = slp_dto_1.compareRankingDto.parse(req.query);
            const result = await service.compareRanking(payload.student_user_id);
            res.json((0, response_1.ok)(result, "Compare ranking success"));
        }
        catch (e) {
            next(e);
        }
    }
}
exports.SlpController = SlpController;
