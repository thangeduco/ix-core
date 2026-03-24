import { ok } from "../../../src/shared/utils/response";

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

import { PltController } from "../../../src/modules/plt/controllers/plt.controller";

describe("PltController unit test", () => {
  let controller: PltController;

  const createMockRequest = (overrides = {}) =>
    ({
      body: {},
      params: {},
      query: {},
      headers: {},
      ...overrides
    } as any);

  const createMockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const createMockNext = () => jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new PltController();
  });

  describe("sendNotification", () => {
    it("should send notification successfully", async () => {
      const req = createMockRequest({
        body: {
          user_id: "user-1",
          title: "Welcome",
          message: "Hello user",
          type: "push"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = {
        id: "noti-1",
        user_id: "user-1",
        title: "Welcome",
        message: "Hello user",
        type: "push",
        is_read: false
      };

      mockPltService.sendNotification.mockResolvedValue(result);

      await controller.sendNotification(req, res, next);

      expect(mockPltService.sendNotification).toHaveBeenCalledWith({
        user_id: "user-1",
        title: "Welcome",
        message: "Hello user",
        type: "push"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Send notification success")
      );
    });

    it("should call next when body invalid", async () => {
      const req = createMockRequest({
        body: {
          user_id: "user-1",
          title: "",
          message: "Hello user",
          type: "push"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.sendNotification(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("getUserNotifications", () => {
    it("should get user notifications successfully", async () => {
      const req = createMockRequest({
        params: {
          userId: "user-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = [
        {
          id: "noti-1",
          user_id: "user-1",
          title: "Welcome"
        }
      ];

      mockPltService.getUserNotifications.mockResolvedValue(result);

      await controller.getUserNotifications(req, res, next);

      expect(mockPltService.getUserNotifications).toHaveBeenCalledWith("user-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get user notifications success")
      );
    });

    it("should call next when userId missing", async () => {
      const req = createMockRequest({
        params: {}
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getUserNotifications(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("markAsRead", () => {
    it("should mark notification as read successfully", async () => {
      const req = createMockRequest({
        params: {
          notificationId: "noti-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = {
        id: "noti-1",
        is_read: true
      };

      mockPltService.markNotificationRead.mockResolvedValue(result);

      await controller.markAsRead(req, res, next);

      expect(mockPltService.markNotificationRead).toHaveBeenCalledWith("noti-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Mark notification as read success")
      );
    });

    it("should call next when notificationId missing", async () => {
      const req = createMockRequest({
        params: {}
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.markAsRead(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("uploadFile", () => {
    it("should upload file successfully", async () => {
      const req = createMockRequest({
        body: {
          file_name: "document.pdf",
          file_type: "pdf",
          uploaded_by: "user-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      const result = {
        id: "file-1",
        url: "https://mock-s3/document.pdf",
        file_name: "document.pdf",
        file_type: "pdf",
        uploaded_by: "user-1"
      };

      mockPltService.uploadFile.mockResolvedValue(result);

      await controller.uploadFile(req, res, next);

      expect(mockPltService.uploadFile).toHaveBeenCalledWith({
        file_name: "document.pdf",
        file_type: "pdf",
        uploaded_by: "user-1"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Upload file success")
      );
    });

    it("should call next when body invalid", async () => {
      const req = createMockRequest({
        body: {
          file_name: "",
          file_type: "pdf",
          uploaded_by: "user-1"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.uploadFile(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});