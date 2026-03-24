import express from "express";
import request from "supertest";

const mockSendNotification = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "sendNotification" });
});

const mockGetUserNotifications = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "getUserNotifications" });
});

const mockMarkAsRead = jest.fn((req, res) => {
  res.status(200).json({ ok: true, api: "markAsRead" });
});

const mockUploadFile = jest.fn((req, res) => {
  res.status(201).json({ ok: true, api: "uploadFile" });
});

jest.mock("../../../src/modules/plt/controllers/plt.controller", () => {
  return {
    PltController: jest.fn().mockImplementation(() => ({
      sendNotification: mockSendNotification,
      getUserNotifications: mockGetUserNotifications,
      markAsRead: mockMarkAsRead,
      uploadFile: mockUploadFile
    }))
  };
});

import { pltRoutes } from "../../../src/modules/plt/routes/plt.routes";

describe("plt.routes smoke test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/plt", pltRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /plt/health should return health response", async () => {
    const res = await request(app).get("/plt/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "plt",
      ok: true
    });
  });

  it("POST /plt/notifications should call controller.sendNotification", async () => {
    const res = await request(app)
      .post("/plt/notifications")
      .send({
        user_id: "user-1",
        title: "Test title",
        message: "Test message",
        type: "push"
      });

    expect(res.status).toBe(201);
    expect(mockSendNotification).toHaveBeenCalledTimes(1);
  });

  it("GET /plt/users/:userId/notifications should call controller.getUserNotifications", async () => {
    const res = await request(app).get("/plt/users/user-1/notifications");

    expect(res.status).toBe(200);
    expect(mockGetUserNotifications).toHaveBeenCalledTimes(1);
  });

  it("PUT /plt/notifications/:notificationId/read should call controller.markAsRead", async () => {
    const res = await request(app).put("/plt/notifications/noti-1/read");

    expect(res.status).toBe(200);
    expect(mockMarkAsRead).toHaveBeenCalledTimes(1);
  });

  it("POST /plt/files/upload should call controller.uploadFile", async () => {
    const res = await request(app)
      .post("/plt/files/upload")
      .send({
        file_name: "test.pdf",
        file_type: "pdf",
        uploaded_by: "user-1"
      });

    expect(res.status).toBe(201);
    expect(mockUploadFile).toHaveBeenCalledTimes(1);
  });
});