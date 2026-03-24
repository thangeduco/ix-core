"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileDto = exports.sendNotificationDto = void 0;
const zod_1 = require("zod");
exports.sendNotificationDto = zod_1.z.object({
    user_id: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    message: zod_1.z.string().min(1),
    type: zod_1.z.enum(["push", "email", "in_app"])
});
exports.uploadFileDto = zod_1.z.object({
    file_name: zod_1.z.string().min(1),
    file_type: zod_1.z.enum(["image", "pdf", "doc", "other"]),
    file_buffer: zod_1.z.any().optional(),
    uploaded_by: zod_1.z.string().min(1)
});
