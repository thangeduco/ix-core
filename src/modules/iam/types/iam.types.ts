export type UserRole = "student" | "parent" | "teacher" | "admin";

export interface User {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  password_hash: string;
  status: string;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  display_name: string | null;
  avatar_url: string | null;
  gender: string | null;
  date_of_birth: Date | null;
  address: string | null;
  province_code: string | null;
  school_name: string | null;
  grade: string | null;
  bio: string | null;
  slogen: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserSession {
  id: number;
  user_id: string | null;
  access_token_hash: string | null;
  refresh_token_hash: string | null;
  device_type: string | null;
  device_name: string | null;
  ip_address: string | null;
  user_agent: string | null;
  expired_at: Date | null;
  revoked_at: Date | null;
  created_at: Date | null;
}

export interface AuthUserResponse {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  display_name?: string | null;
  avatar_url?: string | null;
  slogen?: string | null;
  role_code?: UserRole | null;
  roles: UserRole[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  session: {
    session_id: number;
    device_type: string | null;
    device_name: string | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string | null;
    expired_at: string | null;
  };
  user: AuthUserResponse;
}