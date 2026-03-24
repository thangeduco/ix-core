export type EnrollmentStatus = "active" | "inactive" | "pending" | "cancelled";
export type GroupOwnerType = "student" | "teacher" | "parent";
export type GroupVisibility = "private" | "invite_only" | "public";
export type GroupStatus = "active" | "inactive" | "archived";
export type GroupMemberRole = "owner" | "admin" | "member";
export type GroupJoinRequestStatus = "pending" | "approved" | "rejected";

export interface ClassEntity {
  id: string;
  course_id: string;
  name: string;
  description: string | null;
  status: string;
  start_date: Date | null;
  end_date: Date | null;
}

export interface Enrollment {
  id: string;
  course_id: string;
  class_id: string | null;
  student_user_id: string;
  enrollment_status: EnrollmentStatus;
  enrolled_at: Date;
}

export interface GroupEntity {
  id: string;
  name: string;
  description: string | null;
  owner_user_id: string;
  owner_type: GroupOwnerType;
  visibility: GroupVisibility;
  invite_code: string | null;
  avatar_file_id: string | null;
  status: GroupStatus;
  created_at: Date;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  member_role: GroupMemberRole;
  joined_at: Date;
  status: string;
}

export interface GroupJoinRequest {
  id: string;
  group_id: string;
  requester_user_id: string;
  status: GroupJoinRequestStatus;
  requested_at: Date;
  reviewed_at: Date | null;
  reviewed_by: string | null;
}
