"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IamRepository = void 0;
const postgres_1 = require("../../../shared/db/postgres");
class IamRepository {
    async findUserByEmailOrPhone(emailOrPhone) {
        const query = `
      select 
        u.id,
        u.username,
        u.email,
        u.phone,
        u.password_hash,
        u.status,
        u.last_login_at,
        u.created_at,
        u.updated_at
      from users u
      where u.email = $1 or u.phone = $1
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [emailOrPhone]);
        return result.rows[0] || null;
    }
    async findUserById(userId) {
        const query = `
      select 
        u.id,
        u.username,
        u.email,
        u.phone,
        u.password_hash,
        u.status,
        u.last_login_at,
        u.created_at,
        u.updated_at
      from users u
      where u.id = $1
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [userId]);
        return result.rows[0] || null;
    }
    async findUserProfileByUserId(userId) {
        const query = `
      select
        up.id,
        up.user_id,
        up.full_name,
        up.display_name,
        up.avatar_url,
        up.gender,
        up.date_of_birth,
        up.address,
        up.province_code,
        up.school_name,
        up.grade,
        up.bio,
        up.slogen,
        up.created_at,
        up.updated_at
      from user_profiles up
      where up.user_id = $1
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [userId]);
        return result.rows[0] || null;
    }
    async findUserRoles(userId) {
        const query = `
      select ur.role_code
      from user_roles ur
      where ur.user_id = $1
      order by ur.role_code
    `;
        const result = await postgres_1.pool.query(query, [userId]);
        return result.rows.map((row) => row.role_code);
    }
    async createUser(payload) {
        const query = `
      insert into users (
        username,
        email,
        phone,
        password_hash,
        status,
        created_at,
        updated_at
      )
      values ($1, $2, $3, $4, 'active', now(), now())
      returning *
    `;
        const values = [
            payload.username,
            payload.email || null,
            payload.phone || null,
            payload.password_hash
        ];
        const result = await postgres_1.pool.query(query, values);
        return result.rows[0];
    }
    async createUserProfile(payload) {
        const query = `
      insert into user_profiles (
        user_id,
        full_name,
        display_name,
        avatar_url,
        slogen,
        created_at,
        updated_at
      )
      values ($1, $2, $3, $4, $5, now(), now())
      returning *
    `;
        const result = await postgres_1.pool.query(query, [
            payload.user_id,
            payload.full_name,
            payload.display_name || null,
            payload.avatar_url || null,
            payload.slogen || null
        ]);
        return result.rows[0];
    }
    async assignRole(userId, roleCode) {
        const query = `
      insert into user_roles (user_id, role_id, role_code, assigned_at)
      select $1, r.id, r.code, now()
      from roles r
      where r.code = $2
      returning *
    `;
        const result = await postgres_1.pool.query(query, [userId, roleCode]);
        return result.rows[0] || null;
    }
    async updateLastLogin(userId) {
        const query = `
      update users
      set last_login_at = now(),
          updated_at = now()
      where id = $1
    `;
        await postgres_1.pool.query(query, [userId]);
    }
    async updateProfile(userId, payload) {
        const allowedFields = [
            "full_name",
            "display_name",
            "avatar_url",
            "gender",
            "date_of_birth",
            "address",
            "province_code",
            "school_name",
            "grade",
            "bio",
            "slogen"
        ];
        const entries = Object.entries(payload).filter(([key, value]) => allowedFields.includes(key) && value !== undefined);
        if (entries.length === 0) {
            return this.findUserProfileByUserId(userId);
        }
        const setClauses = entries.map(([key], index) => `${key} = $${index + 2}`);
        const values = [userId, ...entries.map(([, value]) => value)];
        const query = `
      update user_profiles
      set ${setClauses.join(", ")},
          updated_at = now()
      where user_id = $1
      returning *
    `;
        const result = await postgres_1.pool.query(query, values);
        return result.rows[0];
    }
    async createUserSession(payload) {
        const query = `
      insert into user_sessions (
        user_id,
        access_token_hash,
        refresh_token_hash,
        device_type,
        device_name,
        ip_address,
        user_agent,
        expired_at,
        created_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, now())
      returning
        id,
        user_id,
        access_token_hash,
        refresh_token_hash,
        device_type,
        device_name,
        ip_address,
        user_agent,
        expired_at,
        revoked_at,
        created_at
    `;
        const values = [
            payload.user_id,
            payload.access_token_hash,
            payload.refresh_token_hash,
            payload.device_type || null,
            payload.device_name || null,
            payload.ip_address || null,
            payload.user_agent || null,
            payload.expired_at
        ];
        const result = await postgres_1.pool.query(query, values);
        return result.rows[0];
    }
    async findActiveSessionByAccessTokenHash(accessTokenHash) {
        const query = `
      select
        us.id,
        us.user_id,
        us.access_token_hash,
        us.refresh_token_hash,
        us.device_type,
        us.device_name,
        us.ip_address,
        us.user_agent,
        us.expired_at,
        us.revoked_at,
        us.created_at
      from user_sessions us
      where us.access_token_hash = $1
        and us.revoked_at is null
        and (us.expired_at is null or us.expired_at > now())
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [accessTokenHash]);
        return result.rows[0] || null;
    }
    async findActiveSessionByRefreshTokenHash(refreshTokenHash) {
        const query = `
      select
        us.id,
        us.user_id,
        us.access_token_hash,
        us.refresh_token_hash,
        us.device_type,
        us.device_name,
        us.ip_address,
        us.user_agent,
        us.expired_at,
        us.revoked_at,
        us.created_at
      from user_sessions us
      where us.refresh_token_hash = $1
        and us.revoked_at is null
        and (us.expired_at is null or us.expired_at > now())
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [refreshTokenHash]);
        return result.rows[0] || null;
    }
    async findSessionByIdAndUserId(sessionId, userId) {
        const query = `
      select
        us.id,
        us.user_id,
        us.access_token_hash,
        us.refresh_token_hash,
        us.device_type,
        us.device_name,
        us.ip_address,
        us.user_agent,
        us.expired_at,
        us.revoked_at,
        us.created_at
      from user_sessions us
      where us.id = $1
        and us.user_id = $2
      limit 1
    `;
        const result = await postgres_1.pool.query(query, [sessionId, userId]);
        return result.rows[0] || null;
    }
    async getActiveSessionsByUserId(userId) {
        const query = `
      select
        us.id,
        us.user_id,
        us.access_token_hash,
        us.refresh_token_hash,
        us.device_type,
        us.device_name,
        us.ip_address,
        us.user_agent,
        us.expired_at,
        us.revoked_at,
        us.created_at
      from user_sessions us
      where us.user_id = $1
        and us.revoked_at is null
        and (us.expired_at is null or us.expired_at > now())
      order by us.created_at desc, us.id desc
    `;
        const result = await postgres_1.pool.query(query, [userId]);
        return result.rows;
    }
    async revokeSessionById(sessionId) {
        const query = `
      update user_sessions
      set revoked_at = now()
      where id = $1
        and revoked_at is null
      returning
        id,
        user_id,
        access_token_hash,
        refresh_token_hash,
        device_type,
        device_name,
        ip_address,
        user_agent,
        expired_at,
        revoked_at,
        created_at
    `;
        const result = await postgres_1.pool.query(query, [sessionId]);
        return result.rows[0] || null;
    }
    async revokeSessionByAccessTokenHash(accessTokenHash) {
        const query = `
      update user_sessions
      set revoked_at = now()
      where access_token_hash = $1
        and revoked_at is null
      returning
        id,
        user_id,
        access_token_hash,
        refresh_token_hash,
        device_type,
        device_name,
        ip_address,
        user_agent,
        expired_at,
        revoked_at,
        created_at
    `;
        const result = await postgres_1.pool.query(query, [accessTokenHash]);
        return result.rows[0] || null;
    }
    async revokeAllUserSessions(userId) {
        const query = `
      update user_sessions
      set revoked_at = now()
      where user_id = $1
        and revoked_at is null
      returning id
    `;
        const result = await postgres_1.pool.query(query, [userId]);
        return {
            revoked_count: result.rowCount || 0
        };
    }
    async rotateSessionTokens(payload) {
        const query = `
      update user_sessions
      set access_token_hash = $2,
          refresh_token_hash = $3,
          expired_at = $4
      where id = $1
        and revoked_at is null
      returning
        id,
        user_id,
        access_token_hash,
        refresh_token_hash,
        device_type,
        device_name,
        ip_address,
        user_agent,
        expired_at,
        revoked_at,
        created_at
    `;
        const result = await postgres_1.pool.query(query, [
            payload.session_id,
            payload.access_token_hash,
            payload.refresh_token_hash,
            payload.expired_at
        ]);
        return result.rows[0] || null;
    }
}
exports.IamRepository = IamRepository;
