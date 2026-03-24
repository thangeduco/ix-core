import { TewRepository } from "../repositories/tew.repository";

export class TewService {
  private readonly tewRepository = new TewRepository();

  async createWeeklyReview(payload: {
    student_user_id: string;
    course_week_id: string;
    teacher_user_id: string;
    overall_comment?: string;
    knowledge_comment?: string;
    skill_comment?: string;
    attitude_comment?: string;
    scores?: Array<{
      score_type: "lesson_score" | "homework_score" | "class_test_score" | "periodic_exam_score" | "overall_score";
      score_value: number;
      max_score?: number;
    }>;
    comments?: Array<{
      comment_type:
        | "lesson_comment"
        | "homework_comment"
        | "class_test_comment"
        | "periodic_exam_comment"
        | "overall_comment"
        | "knowledge_comment"
        | "skill_comment"
        | "attitude_comment";
      comment_text: string;
    }>;
  }) {
    const existing = await this.tewRepository.findWeeklyReviewByStudentAndWeek(
      payload.student_user_id,
      payload.course_week_id
    );

    if (existing) {
      throw new Error("Weekly review already exists");
    }

    const review = await this.tewRepository.createWeeklyReview(payload);

    const createdScores = [];
    for (const score of payload.scores || []) {
      const item = await this.tewRepository.createWeeklyReviewScore({
        weekly_review_id: review.id,
        score_type: score.score_type,
        score_value: score.score_value,
        max_score: score.max_score
      });
      createdScores.push(item);
    }

    const createdComments = [];
    for (const comment of payload.comments || []) {
      const item = await this.tewRepository.createWeeklyReviewComment({
        weekly_review_id: review.id,
        comment_type: comment.comment_type,
        comment_text: comment.comment_text
      });
      createdComments.push(item);
    }

    return {
      review,
      scores: createdScores,
      comments: createdComments
    };
  }

  async updateWeeklyReview(reviewId: string, payload: {
    overall_comment?: string;
    knowledge_comment?: string;
    skill_comment?: string;
    attitude_comment?: string;
    scores?: Array<{
      score_type: "lesson_score" | "homework_score" | "class_test_score" | "periodic_exam_score" | "overall_score";
      score_value: number;
      max_score?: number;
    }>;
    comments?: Array<{
      comment_type:
        | "lesson_comment"
        | "homework_comment"
        | "class_test_comment"
        | "periodic_exam_comment"
        | "overall_comment"
        | "knowledge_comment"
        | "skill_comment"
        | "attitude_comment";
      comment_text: string;
    }>;
  }) {
    const review = await this.tewRepository.findWeeklyReviewById(reviewId);

    if (!review) {
      throw new Error("Weekly review not found");
    }

    const updatedReview = await this.tewRepository.updateWeeklyReview(reviewId, {
      overall_comment: payload.overall_comment,
      knowledge_comment: payload.knowledge_comment,
      skill_comment: payload.skill_comment,
      attitude_comment: payload.attitude_comment
    });

    if (payload.scores) {
      await this.tewRepository.deleteWeeklyReviewScores(reviewId);
      for (const score of payload.scores) {
        await this.tewRepository.createWeeklyReviewScore({
          weekly_review_id: reviewId,
          score_type: score.score_type,
          score_value: score.score_value,
          max_score: score.max_score
        });
      }
    }

    if (payload.comments) {
      await this.tewRepository.deleteWeeklyReviewComments(reviewId);
      for (const comment of payload.comments) {
        await this.tewRepository.createWeeklyReviewComment({
          weekly_review_id: reviewId,
          comment_type: comment.comment_type,
          comment_text: comment.comment_text
        });
      }
    }

    const scores = await this.tewRepository.listWeeklyReviewScores(reviewId);
    const comments = await this.tewRepository.listWeeklyReviewComments(reviewId);

    return {
      review: updatedReview,
      scores,
      comments
    };
  }

  async getWeeklyReviewDetail(reviewId: string) {
    const review = await this.tewRepository.findWeeklyReviewById(reviewId);

    if (!review) {
      throw new Error("Weekly review not found");
    }

    const [scores, comments] = await Promise.all([
      this.tewRepository.listWeeklyReviewScores(reviewId),
      this.tewRepository.listWeeklyReviewComments(reviewId)
    ]);

    return {
      review,
      scores,
      comments
    };
  }

  async getReviewWorkspace(studentUserId: string, courseWeekId: string) {
    const [weekProgress, quizAttempts, homeworkSubmissions, classTestResults] = await Promise.all([
      this.tewRepository.findStudentWeekProgress(studentUserId, courseWeekId),
      this.tewRepository.listQuizAttemptsByStudentAndWeek(studentUserId, courseWeekId),
      this.tewRepository.listHomeworkSubmissionsByStudentAndWeek(studentUserId, courseWeekId),
      this.tewRepository.listClassTestResultsByStudentAndWeek(studentUserId, courseWeekId)
    ]);

    return {
      week_progress: weekProgress,
      quiz_attempts: quizAttempts,
      homework_submissions: homeworkSubmissions,
      class_test_results: classTestResults
    };
  }

  async createTeacherAssignedTask(payload: {
    weekly_review_id?: string;
    student_user_id: string;
    parent_user_id: string;
    title: string;
    description?: string;
    due_at?: string;
    status?: "pending" | "in_progress" | "completed" | "cancelled" | "expired";
  }) {
    return this.tewRepository.createTeacherAssignedTask(payload);
  }

  async listTeacherAssignedTasks(query: {
    student_user_id?: string;
    parent_user_id?: string;
    status?: string;
    page?: string;
    limit?: string;
  }) {
    return this.tewRepository.listTeacherAssignedTasks({
      student_user_id: query.student_user_id,
      parent_user_id: query.parent_user_id,
      status: query.status,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20
    });
  }

  async createStudentHomeworkOverride(payload: {
    student_user_id: string;
    homework_sheet_id: string;
    extra_instruction?: string;
    attachment_file_id?: string;
    created_by: string;
  }) {
    return this.tewRepository.createStudentHomeworkOverride(payload);
  }

  async createOfflineActivityRecord(payload: {
    class_id: string;
    course_week_id: string;
    student_user_id: string;
    activity_type: string;
    score?: number;
    comment?: string;
    recorded_by: string;
  }) {
    return this.tewRepository.createOfflineActivityRecord(payload);
  }
}
