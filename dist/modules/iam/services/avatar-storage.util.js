"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserAvatar = saveUserAvatar;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
function sanitizeFileExtension(extension) {
    return extension.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}
function resolveExtension(file) {
    const originalExtension = path_1.default.extname(file.originalname || "");
    const cleanedOriginalExtension = sanitizeFileExtension(originalExtension.replace(".", ""));
    if (cleanedOriginalExtension) {
        return cleanedOriginalExtension;
    }
    switch (file.mimetype) {
        case "image/png":
            return "png";
        case "image/jpeg":
        case "image/jpg":
            return "jpg";
        case "image/webp":
            return "webp";
        default:
            return "jpg";
    }
}
async function saveUserAvatar(params) {
    const { userId, file, baseUrl } = params;
    const extension = resolveExtension(file);
    const userAvatarDirectory = path_1.default.join(process.cwd(), "storage", "avatars", `user_${userId}`);
    await promises_1.default.mkdir(userAvatarDirectory, { recursive: true });
    const existingFiles = await promises_1.default.readdir(userAvatarDirectory).catch(() => []);
    await Promise.all(existingFiles
        .filter((fileName) => fileName.startsWith("avatar."))
        .map((fileName) => promises_1.default.unlink(path_1.default.join(userAvatarDirectory, fileName))));
    const fileName = `avatar.${extension}`;
    const absoluteFilePath = path_1.default.join(userAvatarDirectory, fileName);
    await promises_1.default.writeFile(absoluteFilePath, file.buffer);
    const avatarRelativePath = `avatars/user_${userId}/${fileName}`;
    const avatarUrl = `${baseUrl}/static/${avatarRelativePath}`;
    return {
        avatar_relative_path: avatarRelativePath,
        avatar_url: avatarUrl
    };
}
