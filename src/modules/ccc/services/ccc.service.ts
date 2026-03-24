import { CccRepository } from "../repositories/ccc.repository";

export class CccService {
  private readonly cccRepository = new CccRepository();

  async listCourses(query: {
    subject?: string;
    grade_level?: string;
    course_type?: string;
    status?: string;
    keyword?: string;
    page?: string;
    limit?: string;
  }) {
    return this.cccRepository.listCourses({
      subject: query.subject,
      grade_level: query.grade_level,
      course_type: query.course_type,
      status: query.status,
      keyword: query.keyword,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20
    });
  }

  async createCourse(payload: {
    code: string;
    name: string;
    subject: string;
    grade_level: string;
    course_type: string;
    description?: string;
    status?: "draft" | "published" | "archived";
    thumbnail_file_id?: string;
    created_by?: string;
  }) {
    return this.cccRepository.createCourse(payload);
  }

  async getCourseDetail(courseId: string) {
    const course = await this.cccRepository.findCourseById(courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    const weeks = await this.cccRepository.listCourseWeeks(courseId);

    return {
      ...course,
      weeks
    };
  }

  async updateCourse(courseId: string, payload: Record<string, unknown>) {
    const updated = await this.cccRepository.updateCourse(courseId, payload);

    if (!updated) {
      throw new Error("Course not found");
    }

    return updated;
  }

  async listCourseWeeks(courseId: string) {
    return this.cccRepository.listCourseWeeks(courseId);
  }

  async createCourseWeek(courseId: string, payload: {
    week_no: number;
    title: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
  }) {
    const course = await this.cccRepository.findCourseById(courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    return this.cccRepository.createCourseWeek(courseId, payload);
  }

  async getWeekDetail(weekId: string) {
    const overview = await this.cccRepository.listWeekOverview(weekId);

    if (!overview.week) {
      throw new Error("Course week not found");
    }

    return overview;
  }

  async createLesson(weekId: string, payload: {
    title: string;
    lesson_type: "video" | "reading" | "live" | "other";
    display_order: number;
    description?: string;
    status?: string;
  }) {
    const week = await this.cccRepository.findCourseWeekById(weekId);

    if (!week) {
      throw new Error("Course week not found");
    }

    return this.cccRepository.createLesson(weekId, payload);
  }

  async getLessonDetail(lessonId: string) {
    const lesson = await this.cccRepository.findLessonById(lessonId);

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    return lesson;
  }

  async createQuiz(weekId: string, payload: {
    title: string;
    quiz_type: "weekly_quiz" | "practice_quiz" | "mock_test";
    time_limit_minutes?: number;
    max_attempts?: number;
    passing_score?: number;
    status?: string;
  }) {
    const week = await this.cccRepository.findCourseWeekById(weekId);

    if (!week) {
      throw new Error("Course week not found");
    }

    return this.cccRepository.createQuiz(weekId, payload);
  }

  async getQuizDetail(quizId: string) {
    const quiz = await this.cccRepository.findQuizById(quizId);

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    return quiz;
  }

  async listHomeworks(weekId: string) {
    return this.cccRepository.listHomeworksByWeek(weekId);
  }

  async createHomework(weekId: string, payload: {
    title: string;
    description?: string;
    attachment_file_id?: string;
    due_at?: string;
    status?: string;
  }) {
    const week = await this.cccRepository.findCourseWeekById(weekId);

    if (!week) {
      throw new Error("Course week not found");
    }

    return this.cccRepository.createHomework(weekId, payload);
  }
}
