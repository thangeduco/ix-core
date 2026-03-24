import { z } from "zod";

export const rankingQueryDto = z.object({
  scope: z.enum(["class", "group", "system"]),
  scope_id: z.string().optional(),
  period: z.enum(["weekly", "course"]),
  course_id: z.string(),
  week_id: z.string().optional()
});

export const compareRankingDto = z.object({
  student_user_id: z.string(),
  course_id: z.string(),
  week_id: z.string().optional()
});
