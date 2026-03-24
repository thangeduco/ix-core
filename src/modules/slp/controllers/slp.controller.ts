import { Request, Response, NextFunction } from "express";
import { ok } from "../../../shared/utils/response";
import { SlpService } from "../services/slp.service";
import { rankingQueryDto, compareRankingDto } from "../dtos/slp.dto";

const service = new SlpService();

export class SlpController {

  async calculateRanking(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = rankingQueryDto.parse(req.body);
      const result = await service.calculateRanking(payload);
      res.json(ok(result, "Calculate ranking success"));
    } catch (e) {
      next(e);
    }
  }

  async getRanking(req: Request, res: Response, next: NextFunction) {
    try {
      const query = rankingQueryDto.parse(req.query);
      const result = await service.getRanking(query);
      res.json(ok(result, "Get ranking success"));
    } catch (e) {
      next(e);
    }
  }

  async compareRanking(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = compareRankingDto.parse(req.query);
      const result = await service.compareRanking(payload.student_user_id);
      res.json(ok(result, "Compare ranking success"));
    } catch (e) {
      next(e);
    }
  }
}
