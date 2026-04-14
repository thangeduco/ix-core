import { randomUUID, createHash, randomBytes } from "crypto";
import { IamRepository } from "../repositories/iam.repository";
import { saveUserAvatar } from "./avatar-storage.util";

type UserRole = "student" | "parent" | "teacher" | "admin";

type DeviceInfo = {
  ip_address?: string;
  user_agent?: string;
  device_type?: string;
  device_name?: string;
};

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export class IamService {
  private readonly iamRepository = new IamRepository();

  private hashText(value: string) {
    return createHash("sha256").update(value).digest("hex");
  }

  private generateOpaqueToken(prefix: string) {
    return `${prefix}_${randomUUID()}_${randomBytes(24).toString("hex")}`;
  }

  private buildLoginUserResponse(params: {
    user: {
      id: string;
      email: string | null;
      phone: string | null;
    };
    profile: {
      full_name: string;
      display_name: string | null;
      avatar_url: string | null;
      slogen: string | null;
    } | null;
    roles: string[];
  }) {
    return {
      id: params.user.id,
      email: params.user.email,
      phone: params.user.phone,
      full_name: params.profile?.full_name || "",
      display_name: params.profile?.display_name || null,
      avatar_url: params.profile?.avatar_url || null,
      slogen: params.profile?.slogen || null,
      role_code: params.roles[0] || null,
      roles: params.roles
    };
  }

  async authenticateAccessToken(accessToken: string) {
    const accessTokenHash = this.hashText(accessToken);

    const session =
      await this.iamRepository.findActiveSessionByAccessTokenHash(
        accessTokenHash
      );

    if (!session || !session.user_id) {
      return null;
    }

    return {
      session_id: session.id,
      user_id: session.user_id
    };
  }

  async register(payload: {
    full_name: string;
    display_name?: string;
    email?: string;
    phone?: string;
    password: string;
    role?: UserRole;
    role_code?: UserRole;
    avatar_url?: string;
    slogen?: string;
    avatar_file?: Express.Multer.File;
    base_url: string;
  }) {
    const identifier = payload.email || payload.phone || "";

    const existingUser =
      await this.iamRepository.findUserByEmailOrPhone(identifier);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const roleCode = payload.role_code || payload.role;
    if (!roleCode) {
      throw new Error("role_code is required");
    }

    const username = (
      payload.email ||
      payload.phone ||
      randomUUID()
    ).split("@")[0];

    const password_hash = this.hashText(payload.password);

    const user = await this.iamRepository.createUser({
      username,
      email: payload.email,
      phone: payload.phone,
      password_hash
    });

    let resolvedAvatarUrl: string | undefined = payload.avatar_url;

    if (payload.avatar_file) {
      const savedAvatar = await saveUserAvatar({
        userId: user.id,
        file: payload.avatar_file,
        baseUrl: payload.base_url
      });

      resolvedAvatarUrl = savedAvatar.avatar_url;
    }

    await this.iamRepository.createUserProfile({
      user_id: user.id,
      full_name: payload.full_name,
      display_name: payload.display_name,
      avatar_url: resolvedAvatarUrl,
      slogen: payload.slogen
    });

    await this.iamRepository.assignRole(user.id, roleCode);

    const roles = await this.iamRepository.findUserRoles(user.id);
    const profile = await this.iamRepository.findUserProfileByUserId(user.id);

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      full_name: profile?.full_name || payload.full_name,
      display_name: profile?.display_name || payload.display_name || null,
      avatar_url: profile?.avatar_url || null,
      slogen: profile?.slogen || null,
      role_code: roleCode,
      roles
    };
  }

  async login(
    payload: { email_or_phone: string; password: string },
    deviceInfo?: DeviceInfo
  ) {
    const user = await this.iamRepository.findUserByEmailOrPhone(
      payload.email_or_phone
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.status !== "active") {
      throw new Error("User is not active");
    }

    const password_hash = this.hashText(payload.password);

    if (user.password_hash !== password_hash) {
      throw new Error("Invalid credentials");
    }

    await this.iamRepository.updateLastLogin(user.id);

    const roles = await this.iamRepository.findUserRoles(user.id);
    const profile = await this.iamRepository.findUserProfileByUserId(user.id);

    const accessToken = this.generateOpaqueToken("ix_at");
    const refreshToken = this.generateOpaqueToken("ix_rt");

    const accessTokenHash = this.hashText(accessToken);
    const refreshTokenHash = this.hashText(refreshToken);

    const sessionExpiredAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    const session = await this.iamRepository.createUserSession({
      user_id: user.id,
      access_token_hash: accessTokenHash,
      refresh_token_hash: refreshTokenHash,
      device_type: deviceInfo?.device_type,
      device_name: deviceInfo?.device_name,
      ip_address: deviceInfo?.ip_address,
      user_agent: deviceInfo?.user_agent,
      expired_at: sessionExpiredAt
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + ACCESS_TOKEN_TTL_MS).toISOString(),
      session: {
        session_id: session.id,
        device_type: session.device_type,
        device_name: session.device_name,
        ip_address: session.ip_address,
        user_agent: session.user_agent,
        created_at: session.created_at ? session.created_at.toISOString() : null,
        expired_at: session.expired_at ? session.expired_at.toISOString() : null
      },
      user: this.buildLoginUserResponse({
        user,
        profile: profile
          ? {
              full_name: profile.full_name,
              display_name: profile.display_name,
              avatar_url: profile.avatar_url,
              slogen: profile.slogen
            }
          : null,
        roles
      })
    };
  }

  async getMe(userId: string) {
    const user = await this.iamRepository.findUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const roles = await this.iamRepository.findUserRoles(userId);
    const profile = await this.iamRepository.findUserProfileByUserId(userId);

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      status: user.status,
      full_name: profile?.full_name || "",
      display_name: profile?.display_name || null,
      avatar_url: profile?.avatar_url || null,
      slogen: profile?.slogen || null,
      gender: profile?.gender || null,
      date_of_birth: profile?.date_of_birth
        ? profile.date_of_birth.toISOString()
        : null,
      address: profile?.address || null,
      province_code: profile?.province_code || null,
      school_name: profile?.school_name || null,
      grade: profile?.grade || null,
      bio: profile?.bio || null,
      role_code: roles[0] || null,
      roles
    };
  }

  async updateProfile(
    userId: string,
    payload: {
      full_name?: string;
      display_name?: string;
      avatar_url?: string;
      gender?: string;
      date_of_birth?: string;
      address?: string;
      province_code?: string;
      school_name?: string;
      grade?: string;
      bio?: string;
      slogen?: string;
    }
  ) {
    const profile = await this.iamRepository.updateProfile(userId, payload);

    return {
      user_id: userId,
      profile
    };
  }

  async getMySessions(userId: string) {
    const sessions = await this.iamRepository.getActiveSessionsByUserId(userId);

    return sessions.map((session) => ({
      session_id: session.id,
      device_type: session.device_type,
      device_name: session.device_name,
      ip_address: session.ip_address,
      user_agent: session.user_agent,
      created_at: session.created_at ? session.created_at.toISOString() : null,
      expired_at: session.expired_at ? session.expired_at.toISOString() : null
    }));
  }

  async revokeSession(userId: string, sessionId: number) {
    const existingSession = await this.iamRepository.findSessionByIdAndUserId(
      sessionId,
      userId
    );

    if (!existingSession) {
      throw new Error("Session not found");
    }

    await this.iamRepository.revokeSessionById(sessionId);

    return {
      session_id: sessionId,
      status: "revoked"
    };
  }

  async logoutAll(userId: string) {
    const result = await this.iamRepository.revokeAllUserSessions(userId);

    return {
      status: "logged_out_all",
      revoked_count: result.revoked_count
    };
  }

  async requestPasswordReset(payload: { email_or_phone: string }) {
    return {
      request_id: "mock_reset_request_id",
      sent_to: payload.email_or_phone,
      status: "otp_sent"
    };
  }

  async verifyPasswordResetOtp(payload: {
    request_id: string;
    otp_code: string;
  }) {
    return {
      request_id: payload.request_id,
      status: "verified",
      reset_token: "mock_reset_token"
    };
  }

  async confirmPasswordReset(payload: {
    reset_token: string;
    new_password: string;
  }) {
    return {
      status: "password_reset_success"
    };
  }

  async logout(accessToken?: string) {
    if (!accessToken) {
      throw new Error("Access token is required");
    }

    const accessTokenHash = this.hashText(accessToken);
    const session =
      await this.iamRepository.findActiveSessionByAccessTokenHash(
        accessTokenHash
      );

    if (!session) {
      return {
        status: "logged_out",
        revoked: false
      };
    }

    await this.iamRepository.revokeSessionByAccessTokenHash(accessTokenHash);

    return {
      status: "logged_out",
      revoked: true,
      session_id: session.id
    };
  }
}