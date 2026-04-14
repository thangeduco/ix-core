import { LsmRepository } from "../repositories/lsm.repository";
import {
  LsmPendingCourseWeekItem,
  LsmRecentClassEventItem,
  LsmRecentClassEventsResponse,
  LsmRecentStudentEventItem,
  LsmRecentStudentEventsResponse,
  LsmStudentCoursePendingItem,
  LsmStudentCoursesPendingResponse
} from "../types/lsm.types";
import { toNullableNumber } from "./lsm.mapper";

export class LsmStudentOverviewService {
  constructor(private readonly repo: LsmRepository) {}

  async getStudentCoursesWithPendingWeeks(
    studentId: string
  ): Promise<LsmStudentCoursesPendingResponse> {
    const [courseRows, pendingWeekRows] = await Promise.all([
      this.repo.findStudentCourseInfos(studentId),
      this.repo.findStudentPendingWeeks(studentId)
    ]);

    const courseMap = new Map<string, LsmStudentCoursePendingItem>();

    for (const row of courseRows) {
      courseMap.set(String(row.class_id), {
        avatar_url: row.avatar_url ?? null,
        class_name: row.class_name ?? null,
        class_code: row.class_code ?? null,
        slogan: row.slogan ?? null,
        pending_weeks: []
      });
    }

    for (const row of pendingWeekRows) {
      const classId = String(row.class_id);

      if (!courseMap.has(classId)) {
        courseMap.set(classId, {
          avatar_url: null,
          class_name: null,
          class_code: null,
          slogan: null,
          pending_weeks: []
        });
      }

      const pendingWeek: LsmPendingCourseWeekItem = {
        class_week_id: String(row.class_week_id),
        week_no: toNullableNumber(row.week_no),
        title: row.title ?? null,
        total_student_done: Number(row.total_student_done || 0),
        total_student_assigned: Number(row.total_student_assigned || 0)
      };

      courseMap.get(classId)!.pending_weeks.push(pendingWeek);
    }

    return {
      student_id: studentId,
      courses: Array.from(courseMap.values())
    };
  }

  async getRecentStudentEvents(
    studentId: string,
    limit = 10
  ): Promise<LsmRecentStudentEventsResponse> {
    const rows = await this.repo.findRecentStudentEvents(studentId, limit);

    const items: LsmRecentStudentEventItem[] = rows.map((row: any) => ({
      event_name: row.event_name ?? null,
      description: row.description ?? null,
      start_time: row.start_time ?? null
    }));

    return { student_id: studentId, items };
  }

  async getRecentClassEvents(
    classId: string,
    limit = 10
  ): Promise<LsmRecentClassEventsResponse> {
    const rows = await this.repo.findRecentClassEvents(classId, limit);

    const items: LsmRecentClassEventItem[] = rows.map((row: any) => ({
      student_id: String(row.student_id),
      status: row.status ?? null,
      score: toNullableNumber(row.score)
    }));

    return { class_id: classId, items };
  }
}