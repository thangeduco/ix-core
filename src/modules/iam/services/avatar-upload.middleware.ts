import multer from "multer";

const memoryStorage = multer.memoryStorage();

export const avatarUploadMiddleware = multer({
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