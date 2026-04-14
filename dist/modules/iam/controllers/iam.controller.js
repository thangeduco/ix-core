"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IamController = void 0;
const zod_1 = require("zod");
const iam_service_1 = require("../services/iam.service");
const iam_dto_1 = require("../dtos/iam.dto");
const response_1 = require("../../../shared/utils/response");
const iamService = new iam_service_1.IamService();
function extractBearerToken(req) {
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
function getClientIp(req) {
    const forwardedFor = req.headers["x-forwarded-for"];
    if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
        return forwardedFor.split(",")[0].trim();
    }
    if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
        return forwardedFor[0];
    }
    return req.ip || undefined;
}
function getAuthenticatedUserId(req) {
    const authenticatedReq = req;
    const userId = authenticatedReq.iamAuth?.userId;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    return userId;
}
class IamController {
    async register(req, res, next) {
        try {
            const payload = iam_dto_1.registerDto.parse(req.body);
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            const result = await iamService.register({
                ...payload,
                avatar_file: req.file,
                base_url: baseUrl
            });
            res.status(201).json((0, response_1.ok)(result, "Register success"));
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request body",
                    errors: error.issues
                });
            }
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const payload = iam_dto_1.loginDto.parse(req.body);
            const result = await iamService.login(payload, {
                ip_address: getClientIp(req),
                user_agent: req.headers["user-agent"],
                device_type: typeof req.headers["x-device-type"] === "string"
                    ? req.headers["x-device-type"]
                    : "web",
                device_name: typeof req.headers["x-device-name"] === "string"
                    ? req.headers["x-device-name"]
                    : "Unknown device"
            });
            res.json((0, response_1.ok)(result, "Login success"));
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request body",
                    errors: error.issues
                });
            }
            next(error);
        }
    }
    async getMe(req, res, next) {
        try {
            const userId = getAuthenticatedUserId(req);
            const result = await iamService.getMe(userId);
            res.json((0, response_1.ok)(result, "Get me success"));
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const userId = getAuthenticatedUserId(req);
            const payload = iam_dto_1.updateProfileDto.parse(req.body);
            const result = await iamService.updateProfile(userId, payload);
            res.json((0, response_1.ok)(result, "Update profile success"));
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request body",
                    errors: error.issues
                });
            }
            next(error);
        }
    }
    async getMySessions(req, res, next) {
        try {
            const userId = getAuthenticatedUserId(req);
            const result = await iamService.getMySessions(userId);
            res.json((0, response_1.ok)(result, "Get sessions success"));
        }
        catch (error) {
            next(error);
        }
    }
    async revokeSession(req, res, next) {
        try {
            const userId = getAuthenticatedUserId(req);
            const payload = iam_dto_1.revokeSessionDto.parse(req.params);
            const result = await iamService.revokeSession(userId, payload.session_id);
            res.json((0, response_1.ok)(result, "Revoke session success"));
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request params",
                    errors: error.issues
                });
            }
            next(error);
        }
    }
    async logoutAll(req, res, next) {
        try {
            const userId = getAuthenticatedUserId(req);
            const result = await iamService.logoutAll(userId);
            res.json((0, response_1.ok)(result, "Logout all success"));
        }
        catch (error) {
            next(error);
        }
    }
    async requestPasswordReset(req, res, next) {
        try {
            const payload = iam_dto_1.passwordResetRequestDto.parse(req.body);
            const result = await iamService.requestPasswordReset(payload);
            res.json((0, response_1.ok)(result, "Password reset OTP sent"));
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request body",
                    errors: error.issues
                });
            }
            next(error);
        }
    }
    async verifyPasswordResetOtp(req, res, next) {
        try {
            const payload = iam_dto_1.passwordResetVerifyDto.parse(req.body);
            const result = await iamService.verifyPasswordResetOtp(payload);
            res.json((0, response_1.ok)(result, "Password reset OTP verified"));
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request body",
                    errors: error.issues
                });
            }
            next(error);
        }
    }
    async confirmPasswordReset(req, res, next) {
        try {
            const payload = iam_dto_1.passwordResetConfirmDto.parse(req.body);
            const result = await iamService.confirmPasswordReset(payload);
            res.json((0, response_1.ok)(result, "Password reset success"));
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request body",
                    errors: error.issues
                });
            }
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const accessToken = extractBearerToken(req) || undefined;
            const result = await iamService.logout(accessToken);
            res.json((0, response_1.ok)(result, "Logout success"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.IamController = IamController;
