import { z } from "zod";

export const weeklyTaskQueryDto = z.object({
  student_user_id: z.string().min(1),
  week_id: z.string().min(1)
});

export const parentTaskUpdateDto = z.object({
  status: z.enum(["pending", "in_progress", "completed"])
});

export const createParentTaskDto = z.object({
  student_user_id: z.string().min(1),
  parent_user_id: z.string().min(1),
  title: z.string().min(2),
  description: z.string().optional()
});
