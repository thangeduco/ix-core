import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { IamService } from "../services/iam.service";
import {
  loginDto,
  passwordResetConfirmDto,
  passwordResetRequestDto,
  passwordResetVerifyDto,
  registerDto,
  revokeSessionDto,
  updateProfileDto
} from "../dtos/iam.dto";
import { ok } from "../../../shared/utils/response";

const iamService = new IamService();

function extractBearerToken(req: Request): string | null {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

function getClientIp(req: Request): string | undefined {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0];
  }

  return req.ip || undefined;
}

export class IamController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = registerDto.parse(req.body);

      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const result = await iamService.register({
        ...payload,
        avatar_file: req.file,
        base_url: baseUrl
      });

      res.status(201).json(ok(result, "Register success"));
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request body",
          errors: error.issues
        });
      }

      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = loginDto.parse(req.body);

      const result = await iamService.login(payload, {
        ip_address: getClientIp(req),
        user_agent: req.headers["user-agent"],
        device_type:
          typeof req.headers["x-device-type"] === "string"
            ? req.headers["x-device-type"]
            : "web",
        device_name:
          typeof req.headers["x-device-name"] === "string"
            ? req.headers["x-device-name"]
            : "Unknown device"
      });

      res.json(ok(result, "Login success"));
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request body",
          errors: error.issues
        });
      }

      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.headers["x-user-id"] || "mock-user-id");
      const result = await iamService.getMe(userId);
      res.json(ok(result, "Get me success"));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.headers["x-user-id"] || "mock-user-id");
      const payload = updateProfileDto.parse(req.body);
      const result = await iamService.updateProfile(userId, payload);
      res.json(ok(result, "Update profile success"));
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request body",
          errors: error.issues
        });
      }

      next(error);
    }
  }

  async getMySessions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.headers["x-user-id"] || "mock-user-id");
      const result = await iamService.getMySessions(userId);
      res.json(ok(result, "Get sessions success"));
    } catch (error) {
      next(error);
    }
  }

  async revokeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.headers["x-user-id"] || "mock-user-id");
      const payload = revokeSessionDto.parse(req.params);
      const result = await iamService.revokeSession(userId, payload.session_id);
      res.json(ok(result, "Revoke session success"));
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request params",
          errors: error.issues
        });
      }

      next(error);
    }
  }

  async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.headers["x-user-id"] || "mock-user-id");
      const result = await iamService.logoutAll(userId);
      res.json(ok(result, "Logout all success"));
    } catch (error) {
      next(error);
    }
  }

  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = passwordResetRequestDto.parse(req.body);
      const result = await iamService.requestPasswordReset(payload);
      res.json(ok(result, "Password reset OTP sent"));
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request body",
          errors: error.issues
        });
      }

      next(error);
    }
  }

  async verifyPasswordResetOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const payload = passwordResetVerifyDto.parse(req.body);
      const result = await iamService.verifyPasswordResetOtp(payload);
      res.json(ok(result, "Password reset OTP verified"));
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request body",
          errors: error.issues
        });
      }

      next(error);
    }
  }

  async confirmPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = passwordResetConfirmDto.parse(req.body);
      const result = await iamService.confirmPasswordReset(payload);
      res.json(ok(result, "Password reset success"));
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request body",
          errors: error.issues
        });
      }

      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = extractBearerToken(req) || undefined;
      const result = await iamService.logout(accessToken);
      res.json(ok(result, "Logout success"));
    } catch (error) {
      next(error);
    }
  }
}