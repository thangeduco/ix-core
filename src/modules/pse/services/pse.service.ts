import { PseRepository } from "../repositories/pse.repository";

export class PseService {
  private repo = new PseRepository();

  async getWeeklyTasks(studentUserId: string, weekId: string) {
    return this.repo.getWeeklyTasks(studentUserId, weekId);
  }

  async getWeeklySummary(studentUserId: string, weekId: string) {
    return this.repo.getWeeklySummary(studentUserId, weekId);
  }

  async getStudentRanking(studentUserId: string) {
    return this.repo.getStudentRanking(studentUserId);
  }

  async getStudentGroups(studentUserId: string) {
    return this.repo.getStudentGroups(studentUserId);
  }

  async createParentTask(payload: {
    student_user_id: string;
    parent_user_id: string;
    title: string;
    description?: string;
  }) {
    return this.repo.createParentTask(payload);
  }

  async updateParentTask(taskId: string, status: string) {
    return this.repo.updateParentTask(taskId, status);
  }

  async getParentTasks(parentUserId: string) {
    return this.repo.getParentTasks(parentUserId);
  }
}
