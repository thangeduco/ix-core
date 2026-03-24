"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PseService = void 0;
const pse_repository_1 = require("../repositories/pse.repository");
class PseService {
    constructor() {
        this.repo = new pse_repository_1.PseRepository();
    }
    async getWeeklyTasks(studentUserId, weekId) {
        return this.repo.getWeeklyTasks(studentUserId, weekId);
    }
    async getWeeklySummary(studentUserId, weekId) {
        return this.repo.getWeeklySummary(studentUserId, weekId);
    }
    async getStudentRanking(studentUserId) {
        return this.repo.getStudentRanking(studentUserId);
    }
    async getStudentGroups(studentUserId) {
        return this.repo.getStudentGroups(studentUserId);
    }
    async createParentTask(payload) {
        return this.repo.createParentTask(payload);
    }
    async updateParentTask(taskId, status) {
        return this.repo.updateParentTask(taskId, status);
    }
    async getParentTasks(parentUserId) {
        return this.repo.getParentTasks(parentUserId);
    }
}
exports.PseService = PseService;
