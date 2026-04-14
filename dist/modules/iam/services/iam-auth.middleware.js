"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iamAuthMiddleware = iamAuthMiddleware;
const iam_service_1 = require("../services/iam.service");
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
async function iamAuthMiddleware(req, res, next) {
    try {
        const accessToken = extractBearerToken(req);
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: access token is required"
            });
        }
        const authContext = await iamService.authenticateAccessToken(accessToken);
        if (!authContext) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: invalid or expired access token"
            });
        }
        req.iamAuth = {
            userId: authContext.user_id,
            sessionId: authContext.session_id,
            accessToken
        };
        next();
    }
    catch (error) {
        next(error);
    }
}
