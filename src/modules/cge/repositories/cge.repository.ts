import { randomUUID } from "crypto";
import { pool } from "../../../shared/db/postgres";

export class CgeRepository {
  async createClass(payload: {
    course_id: string;
    name: string;
    description?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }) {
    const query = `
      insert into classes (
        course_id,
        name,
        description,
        status,
        start_date,
        end_date
      )
      values ($1, $2, $3, $4, $5, $6)
      returning *
    `;
    const values = [
      payload.course_id,
      payload.name,
      payload.description || null,
      payload.status || "active",
      payload.start_date || null,
      payload.end_date || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findClassById(classId: string) {
    const query = `
      select *
      from classes
      where id = $1
      limit 1
    `;
    const result = await pool.query(query, [classId]);
    return result.rows[0] || null;
  }

  async listClasses(courseId?: string) {
    const values: unknown[] = [];
    let whereClause = "";

    if (courseId) {
      values.push(courseId);
      whereClause = `where course_id = $1`;
    }

    const query = `
      select *
      from classes
      ${whereClause}
      order by id desc
    `;
    const result = await pool.query(query, values);
    return result.rows;
  }

  async assignTeacherToClass(payload: {
    class_id: string;
    teacher_user_id: string;
    role_in_class: string;
  }) {
    const query = `
      insert into class_teachers (
        class_id,
        teacher_user_id,
        role_in_class,
        assigned_at
      )
      values ($1, $2, $3, now())
      returning *
    `;
    const values = [payload.class_id, payload.teacher_user_id, payload.role_in_class];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async createEnrollment(payload: {
    course_id: string;
    class_id?: string;
    student_user_id: string;
    enrollment_status?: string;
  }) {
    const query = `
      insert into enrollments (
        course_id,
        class_id,
        student_user_id,
        enrollment_status,
        enrolled_at
      )
      values ($1, $2, $3, $4, now())
      returning *
    `;
    const values = [
      payload.course_id,
      payload.class_id || null,
      payload.student_user_id,
      payload.enrollment_status || "active"
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async listEnrollments(filters: {
    course_id?: string;
    class_id?: string;
    student_user_id?: string;
    enrollment_status?: string;
    page?: number;
    limit?: number;
  }) {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.course_id) {
      values.push(filters.course_id);
      conditions.push(`course_id = $${values.length}`);
    }

    if (filters.class_id) {
      values.push(filters.class_id);
      conditions.push(`class_id = $${values.length}`);
    }

    if (filters.student_user_id) {
      values.push(filters.student_user_id);
      conditions.push(`student_user_id = $${values.length}`);
    }

    if (filters.enrollment_status) {
      values.push(filters.enrollment_status);
      conditions.push(`enrollment_status = $${values.length}`);
    }

    const whereClause = conditions.length ? `where ${conditions.join(" and ")}` : "";
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    values.push(limit);
    values.push(offset);

    const query = `
      select *
      from enrollments
      ${whereClause}
      order by enrolled_at desc
      limit $${values.length - 1}
      offset $${values.length}
    `;
    const result = await pool.query(query, values);
    return result.rows;
  }

  async createGroup(payload: {
    name: string;
    description?: string;
    owner_user_id: string;
    owner_type: string;
    visibility?: string;
    avatar_file_id?: string;
    status?: string;
  }) {
    const inviteCode = "IXG-" + randomUUID().slice(0, 8).toUpperCase();

    const query = `
      insert into groups (
        name,
        description,
        owner_user_id,
        owner_type,
        visibility,
        invite_code,
        avatar_file_id,
        status,
        created_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, now())
      returning *
    `;
    const values = [
      payload.name,
      payload.description || null,
      payload.owner_user_id,
      payload.owner_type,
      payload.visibility || "invite_only",
      inviteCode,
      payload.avatar_file_id || null,
      payload.status || "active"
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async addGroupOwnerAsMember(payload: {
    group_id: string;
    user_id: string;
  }) {
    const query = `
      insert into group_members (
        group_id,
        user_id,
        member_role,
        joined_at,
        status
      )
      values ($1, $2, 'owner', now(), 'active')
      returning *
    `;
    const result = await pool.query(query, [payload.group_id, payload.user_id]);
    return result.rows[0];
  }

  async findGroupById(groupId: string) {
    const query = `
      select *
      from groups
      where id = $1
      limit 1
    `;
    const result = await pool.query(query, [groupId]);
    return result.rows[0] || null;
  }

  async updateGroup(groupId: string, payload: Record<string, unknown>) {
    const entries = Object.entries(payload).filter(([, value]) => value !== undefined);

    if (!entries.length) {
      return this.findGroupById(groupId);
    }

    const setClauses = entries.map(([key], index) => `${key} = $${index + 2}`);
    const values = [groupId, ...entries.map(([, value]) => value)];

    const query = `
      update groups
      set ${setClauses.join(", ")}
      where id = $1
      returning *
    `;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async listGroups(filters: {
    owner_user_id?: string;
    member_user_id?: string;
    owner_type?: string;
    keyword?: string;
    page?: number;
    limit?: number;
  }) {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let joinClause = "";

    if (filters.member_user_id) {
      joinClause = `join group_members gm on gm.group_id = g.id`;
      values.push(filters.member_user_id);
      conditions.push(`gm.user_id = $${values.length}`);
    }

    if (filters.owner_user_id) {
      values.push(filters.owner_user_id);
      conditions.push(`g.owner_user_id = $${values.length}`);
    }

    if (filters.owner_type) {
      values.push(filters.owner_type);
      conditions.push(`g.owner_type = $${values.length}`);
    }

    if (filters.keyword) {
      values.push(`%${filters.keyword}%`);
      conditions.push(`(g.name ilike $${values.length} or g.description ilike $${values.length})`);
    }

    const whereClause = conditions.length ? `where ${conditions.join(" and ")}` : "";
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    values.push(limit);
    values.push(offset);

    const query = `
      select distinct g.*
      from groups g
      ${joinClause}
      ${whereClause}
      order by g.created_at desc
      limit $${values.length - 1}
      offset $${values.length}
    `;
    const result = await pool.query(query, values);
    return result.rows;
  }

  async listGroupMembers(groupId: string) {
    const query = `
      select *
      from group_members
      where group_id = $1
      order by joined_at asc
    `;
    const result = await pool.query(query, [groupId]);
    return result.rows;
  }

  async addGroupMember(payload: {
    group_id: string;
    user_id: string;
    member_role?: string;
  }) {
    const query = `
      insert into group_members (
        group_id,
        user_id,
        member_role,
        joined_at,
        status
      )
      values ($1, $2, $3, now(), 'active')
      returning *
    `;
    const values = [payload.group_id, payload.user_id, payload.member_role || "member"];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async removeGroupMember(groupId: string, userId: string) {
    const query = `
      delete from group_members
      where group_id = $1 and user_id = $2
      returning *
    `;
    const result = await pool.query(query, [groupId, userId]);
    return result.rows[0] || null;
  }

  async createJoinRequest(payload: {
    group_id: string;
    requester_user_id: string;
  }) {
    const query = `
      insert into group_join_requests (
        group_id,
        requester_user_id,
        status,
        requested_at
      )
      values ($1, $2, 'pending', now())
      returning *
    `;
    const result = await pool.query(query, [payload.group_id, payload.requester_user_id]);
    return result.rows[0];
  }

  async findJoinRequestById(requestId: string) {
    const query = `
      select *
      from group_join_requests
      where id = $1
      limit 1
    `;
    const result = await pool.query(query, [requestId]);
    return result.rows[0] || null;
  }

  async approveJoinRequest(payload: {
    request_id: string;
    reviewed_by: string;
  }) {
    const query = `
      update group_join_requests
      set status = 'approved',
          reviewed_at = now(),
          reviewed_by = $2
      where id = $1
      returning *
    `;
    const result = await pool.query(query, [payload.request_id, payload.reviewed_by]);
    return result.rows[0] || null;
  }

  async rejectJoinRequest(payload: {
    request_id: string;
    reviewed_by: string;
  }) {
    const query = `
      update group_join_requests
      set status = 'rejected',
          reviewed_at = now(),
          reviewed_by = $2
      where id = $1
      returning *
    `;
    const result = await pool.query(query, [payload.request_id, payload.reviewed_by]);
    return result.rows[0] || null;
  }
}
