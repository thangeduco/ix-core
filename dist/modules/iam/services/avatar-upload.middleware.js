"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avatarUploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const memoryStorage = multer_1.default.memoryStorage();
exports.avatarUploadMiddleware = (0, multer_1.default)({
    storage: memoryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp"
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            cb(new Error("Only PNG, JPG, JPEG, WEBP files are allowed"));
            return;
        }
        cb(null, true);
    }
});
