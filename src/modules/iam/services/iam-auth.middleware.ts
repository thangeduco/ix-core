import { NextFunction, Request, Response } from "express";
import { IamService } from "../services/iam.service";

const iamService = new IamService();

export type AuthenticatedIamUser = {
  userId: string;
  sessionId: number;
  accessToken: string;
};

export type AuthenticatedIamRequest = Request & {
  iamAuth?: AuthenticatedIamUser;
};

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

export async function iamAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

    (req as AuthenticatedIamRequest).iamAuth = {
      userId: authContext.user_id,
      sessionId: authContext.session_id,
      accessToken
    };

    next();
  } catch (error) {
    next(error);
  }
}