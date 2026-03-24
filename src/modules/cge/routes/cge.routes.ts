import { Router } from "express";
import { CgeController } from "../controllers/cge.controller";

const cgeController = new CgeController();

export const cgeRoutes = Router();

cgeRoutes.get("/health", (req, res) => {
  res.json({
    module: "cge",
    ok: true
  });
});

cgeRoutes.get("/classes", cgeController.listClasses.bind(cgeController));
cgeRoutes.post("/classes", cgeController.createClass.bind(cgeController));
cgeRoutes.post(
  "/classes/:classId/teachers",
  cgeController.assignTeacherToClass.bind(cgeController)
);

cgeRoutes.get("/enrollments", cgeController.listEnrollments.bind(cgeController));
cgeRoutes.post("/enrollments", cgeController.createEnrollment.bind(cgeController));

cgeRoutes.get("/groups", cgeController.listGroups.bind(cgeController));
cgeRoutes.post("/groups", cgeController.createGroup.bind(cgeController));
cgeRoutes.get("/groups/:groupId", cgeController.getGroupDetail.bind(cgeController));
cgeRoutes.put("/groups/:groupId", cgeController.updateGroup.bind(cgeController));

cgeRoutes.post(
  "/groups/:groupId/invitations",
  cgeController.inviteMembers.bind(cgeController)
);

cgeRoutes.post(
  "/groups/:groupId/join-requests",
  cgeController.createJoinRequest.bind(cgeController)
);

cgeRoutes.post(
  "/groups/:groupId/join-requests/:requestId/approve",
  cgeController.approveJoinRequest.bind(cgeController)
);

cgeRoutes.post(
  "/groups/:groupId/join-requests/:requestId/reject",
  cgeController.rejectJoinRequest.bind(cgeController)
);

cgeRoutes.delete(
  "/groups/:groupId/members/:userId",
  cgeController.removeGroupMember.bind(cgeController)
);

cgeRoutes.post("/groups/:groupId/leave", cgeController.leaveGroup.bind(cgeController));
