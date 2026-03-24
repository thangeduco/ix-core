import express from "express";
import request from "supertest";

const mockPltService = {
  sendNotification: jest.fn(),
  getUserNotifications: jest.fn(),
  markNotificationRead: jest.fn(),
  uploadFile: jest.fn()
};

jest.mock("../../../src/modules/plt/services/plt.service", () => {
  return {
    PltService: jest.fn().mockImplementation(() => mockPltService)
  };
});

import { pltRoutes } from "../../../src/modules/plt/routes/plt.routes";

describe("PLT HTTP-level test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/plt", pltRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /plt/health", async () => {
    const res = await request(app).get("/plt/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      module: "plt",
      ok: true
    });
  });

  it("POST /plt/notifications should send notification", async () => {
    mockPltService.sendNotification.mockResolvedValue({
      id: "noti-1",
      user_id: "user-1",
      title: "Welcome",
      message: "Hello user",
      type: "push",
      is_read: false
    });

    const res = await request(app)
      .post("/plt/notifications")
      .send({
        user_id: "user-1",
        title: "Welcome",
        message: "Hello user",
        type: "push"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("noti-1");
  });

  it("GET /plt/users/:userId/notifications should return notifications", async () => {
    mockPltService.getUserNotifications.mockResolvedValue([
      {
        id: "noti-1",
        user_id: "user-1",
        title: "Welcome",
        message: "Hello user",
        type: "in_app",
        is_read: false
      }
    ]);

    const res = await request(app).get("/plt/users/user-1/notifications");

    expect(res.status).toBe(200);
    expect(res.body.data[0].user_id).toBe("user-1");
  });

  it("PUT /plt/notifications/:notificationId/read should mark as read", async () => {
    mockPltService.markNotificationRead.mockResolvedValue({
      id: "noti-1",
      is_read: true
    });

    const res = await request(app).put("/plt/notifications/noti-1/read");

    expect(res.status).toBe(200);
    expect(res.body.data.is_read).toBe(true);
  });

  it("POST /plt/files/upload should upload file", async () => {
    mockPltService.uploadFile.mockResolvedValue({
      id: "file-1",
      url: "https://mock-s3/test.pdf",
      file_name: "test.pdf",
      file_type: "pdf",
      uploaded_by: "user-1"
    });

    const res = await request(app)
      .post("/plt/files/upload")
      .send({
        file_name: "test.pdf",
        file_type: "pdf",
        uploaded_by: "user-1"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("file-1");
  });

  it("POST /plt/notifications should return validation error when body invalid", async () => {
    const res = await request(app)
      .post("/plt/notifications")
      .send({
        user_id: "user-1",
        title: "",
        message: "Hello user",
        type: "push"
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("GET /plt/users/:userId/notifications should return error when userId missing", async () => {
    const res = await request(app).get("/plt/users//notifications");

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("PUT /plt/notifications/:notificationId/read should return error when notificationId missing", async () => {
    const res = await request(app).put("/plt/notifications//read");

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("POST /plt/files/upload should return validation error when body invalid", async () => {
    const res = await request(app)
      .post("/plt/files/upload")
      .send({
        file_name: "",
        file_type: "pdf",
        uploaded_by: "user-1"
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});