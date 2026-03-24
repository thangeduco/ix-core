import fs from "fs/promises";
import path from "path";

function sanitizeFileExtension(extension: string) {
  return extension.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function resolveExtension(file: Express.Multer.File) {
  const originalExtension = path.extname(file.originalname || "");
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

export async function saveUserAvatar(params: {
  userId: string;
  file: Express.Multer.File;
  baseUrl: string;
}) {
  const { userId, file, baseUrl } = params;

  const extension = resolveExtension(file);
  const userAvatarDirectory = path.join(
    process.cwd(),
    "storage",
    "avatars",
    `user_${userId}`
  );

  await fs.mkdir(userAvatarDirectory, { recursive: true });

  const existingFiles = await fs.readdir(userAvatarDirectory).catch(() => []);
  await Promise.all(
    existingFiles
      .filter((fileName) => fileName.startsWith("avatar."))
      .map((fileName) => fs.unlink(path.join(userAvatarDirectory, fileName)))
  );

  const fileName = `avatar.${extension}`;
  const absoluteFilePath = path.join(userAvatarDirectory, fileName);

  await fs.writeFile(absoluteFilePath, file.buffer);

  const avatarRelativePath = `avatars/user_${userId}/${fileName}`;
  const avatarUrl = `${baseUrl}/static/${avatarRelativePath}`;

  return {
    avatar_relative_path: avatarRelativePath,
    avatar_url: avatarUrl
  };
}