"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cgeRoutes = void 0;
const express_1 = require("express");
const cge_controller_1 = require("../controllers/cge.controller");
const cgeController = new cge_controller_1.CgeController();
exports.cgeRoutes = (0, express_1.Router)();
exports.cgeRoutes.get("/health", (req, res) => {
    res.json({
        module: "cge",
        ok: true
    });
});
exports.cgeRoutes.get("/classes", cgeController.listClasses.bind(cgeController));
exports.cgeRoutes.post("/classes", cgeController.createClass.bind(cgeController));
exports.cgeRoutes.post("/classes/:classId/teachers", cgeController.assignTeacherToClass.bind(cgeController));
exports.cgeRoutes.get("/enrollments", cgeController.listEnrollments.bind(cgeController));
exports.cgeRoutes.post("/enrollments", cgeController.createEnrollment.bind(cgeController));
exports.cgeRoutes.get("/groups", cgeController.listGroups.bind(cgeController));
exports.cgeRoutes.post("/groups", cgeController.createGroup.bind(cgeController));
exports.cgeRoutes.get("/groups/:groupId", cgeController.getGroupDetail.bind(cgeController));
exports.cgeRoutes.put("/groups/:groupId", cgeController.updateGroup.bind(cgeController));
exports.cgeRoutes.post("/groups/:groupId/invitations", cgeController.inviteMembers.bind(cgeController));
exports.cgeRoutes.post("/groups/:groupId/join-requests", cgeController.createJoinRequest.bind(cgeController));
exports.cgeRoutes.post("/groups/:groupId/join-requests/:requestId/approve", cgeController.approveJoinRequest.bind(cgeController));
exports.cgeRoutes.post("/groups/:groupId/join-requests/:requestId/reject", cgeController.rejectJoinRequest.bind(cgeController));
exports.cgeRoutes.delete("/groups/:groupId/members/:userId", cgeController.removeGroupMember.bind(cgeController));
exports.cgeRoutes.post("/groups/:groupId/leave", cgeController.leaveGroup.bind(cgeController));
