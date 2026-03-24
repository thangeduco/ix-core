import { LsmRepository } from "../repositories/lsm.repository";

export class LsmService {
  private readonly lsmRepository = new LsmRepository();

  async startVideoSession(videoId: string, payload: {
    student_user_id: string;
    start_at?: string;
  }) {
    return this.lsmRepository.createVideoLearningSession({
      student_user_id: payload.student_user_id,
      lesson_video_id: videoId,
      start_at: payload.start_at
    });
  }

  async finishVideoSession(sessionId: string, payload: {
    end_at?: string;
    watched_seconds: number;
    completion_rate: number;
    is_completed: boolean;
  }) {
    const session = await this.lsmRepository.findVideoSessionById(sessionId);

    if (!session) {
      throw new Error("Video session not found");
    }

    return this.lsmRepository.updateVideoLearningSession(sessionId, payload);
  }

  async createQuizAttempt(quizId: string, payload: {
    student_user_id: string;
    started_at?: string;
    submitted_at?: string;
    answers: Array<{
      question_id: string;
      selected_option_id: string;
    }>;
  }) {
    const quiz = await this.lsmRepository.findQuizById(quizId);

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const currentAttempts = await this.lsmRepository.countQuizAttempts(quizId, payload.student_user_id);
    const attemptNo = currentAttempts + 1;

    const questionOptionRows = await this.lsmRepository.findQuizQuestionsWithOptions(quizId);

    const optionMap = new Map<string, { question_id: string; is_correct: boolean; question_score: number }>();
    for (const row of questionOptionRows) {
      optionMap.set(row.option_id, {
        question_id: row.question_id,
        is_correct: row.is_correct,
        question_score: Number(row.question_score || 0)
      });
    }

    let totalScore = 0;
    let correctCount = 0;

    const evaluatedAnswers = payload.answers.map((answer) => {
      const option = optionMap.get(answer.selected_option_id);
      const isCorrect = !!option?.is_correct && option.question_id === answer.question_id;
      const scoreAwarded = isCorrect ? Number(option?.question_score || 0) : 0;

      if (isCorrect) {
        correctCount += 1;
        totalScore += scoreAwarded;
      }

      return {
        question_id: answer.question_id,
        selected_option_id: answer.selected_option_id,
        is_correct: isCorrect,
        score_awarded: scoreAwarded
      };
    });

    const attempt = await this.lsmRepository.createQuizAttempt({
      quiz_id: quizId,
      student_user_id: payload.student_user_id,
      attempt_no: attemptNo,
      started_at: payload.started_at,
      submitted_at: payload.submitted_at,
      score: totalScore,
      correct_count: correctCount
    });

    for (const answer of evaluatedAnswers) {
      await this.lsmRepository.createQuizAttemptAnswer({
        quiz_attempt_id: attempt.id,
        question_id: answer.question_id,
        selected_option_id: answer.selected_option_id,
        is_correct: answer.is_correct,
        score_awarded: answer.score_awarded
      });
    }

    return {
      attempt,
      answers: evaluatedAnswers
    };
  }

  async getQuizAttemptDetail(attemptId: string) {
    const attempt = await this.lsmRepository.findQuizAttemptById(attemptId);

    if (!attempt) {
      throw new Error("Quiz attempt not found");
    }

    const answers = await this.lsmRepository.listQuizAttemptAnswers(attemptId);

    return {
      ...attempt,
      answers
    };
  }

  async createHomeworkSubmission(homeworkId: string, payload: {
    student_user_id: string;
    submission_note?: string;
    zip_file_id?: string;
  }) {
    return this.lsmRepository.createHomeworkSubmission({
      homework_sheet_id: homeworkId,
      student_user_id: payload.student_user_id,
      submission_note: payload.submission_note,
      zip_file_id: payload.zip_file_id
    });
  }

  async getHomeworkSubmissionDetail(submissionId: string) {
    const submission = await this.lsmRepository.findHomeworkSubmissionById(submissionId);

    if (!submission) {
      throw new Error("Homework submission not found");
    }

    return submission;
  }

  async listHomeworkSubmissions(homeworkId: string) {
    return this.lsmRepository.listHomeworkSubmissions(homeworkId);
  }

  async createClassworkResult(classworkId: string, payload: {
    student_user_id: string;
    score: number;
    teacher_comment?: string;
  }) {
    return this.lsmRepository.createClassworkResult({
      classwork_sheet_id: classworkId,
      student_user_id: payload.student_user_id,
      score: payload.score,
      teacher_comment: payload.teacher_comment
    });
  }

  async createClassTestResult(classTestId: string, payload: {
    student_user_id: string;
    score: number;
    teacher_comment?: string;
  }) {
    return this.lsmRepository.createClassTestResult({
      class_test_id: classTestId,
      student_user_id: payload.student_user_id,
      score: payload.score,
      teacher_comment: payload.teacher_comment
    });
  }

  async createPeriodicExamResult(examId: string, payload: {
    student_user_id: string;
    score: number;
    rank_in_exam?: number;
  }) {
    return this.lsmRepository.createPeriodicExamResult({
      periodic_exam_id: examId,
      student_user_id: payload.student_user_id,
      score: payload.score,
      rank_in_exam: payload.rank_in_exam
    });
  }

  async getStudentWeekProgress(studentUserId: string, weekId: string) {
    const progress = await this.lsmRepository.findStudentWeekProgress(studentUserId, weekId);

    if (!progress) {
      return this.lsmRepository.upsertStudentWeekProgress({
        student_user_id: studentUserId,
        course_week_id: weekId,
        lesson_completion_rate: 0,
        quiz_completion_rate: 0,
        homework_completion_rate: 0,
        overall_completion_rate: 0,
        status: "not_started"
      });
    }

    return progress;
  }

  async getLearningHistory(studentUserId: string) {
    const [videoSessions, quizAttempts, homeworkSubmissions] = await Promise.all([
      this.lsmRepository.listVideoSessionsByStudent(studentUserId),
      this.lsmRepository.listQuizAttemptsByStudent(studentUserId),
      this.lsmRepository.listHomeworkSubmissionsByStudent(studentUserId)
    ]);

    return {
      video_sessions: videoSessions,
      quiz_attempts: quizAttempts,
      homework_submissions: homeworkSubmissions
    };
  }
}
