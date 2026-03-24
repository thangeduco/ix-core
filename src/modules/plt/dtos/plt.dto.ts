import { z } from "zod";

export const sendNotificationDto = z.object({
  user_id: z.string().min(1),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(["push", "email", "in_app"])
});

export const uploadFileDto = z.object({
  file_name: z.string().min(1),
  file_type: z.enum(["image", "pdf", "doc", "other"]),
  file_buffer: z.any().optional(),
  uploaded_by: z.string().min(1)
});

export type SendNotificationDto = z.infer<typeof sendNotificationDto>;
export type UploadFileDto = z.infer<typeof uploadFileDto>;