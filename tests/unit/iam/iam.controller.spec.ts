import { ok } from "../../../src/shared/utils/response";

// ===== Mock IamService =====
const mockIamService = {
  register: jest.fn(),
  login: jest.fn(),
  getMe: jest.fn(),
  updateProfile: jest.fn(),
  requestPasswordReset: jest.fn(),
  verifyPasswordResetOtp: jest.fn(),
  confirmPasswordReset: jest.fn(),
  logout: jest.fn()
};

jest.mock(".../../../src/modules/iam/services/iam.service", () => {
  return {
    IamService: jest.fn().mockImplementation(() => mockIamService)
  };
});

// IMPORT sau khi mock
import { IamController } from "../../../src/modules/iam/controllers/iam.controller";

describe("IamController Unit Test", () => {
  let controller: IamController;

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
    controller = new IamController();
  });

  // ================= REGISTER =================
  describe("register", () => {
    it("should register successfully", async () => {
      const req = createMockRequest({
        body: {
          full_name: "Test User",
          email: "test@example.com",
          password: "123456",
          role: "student"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const result = { id: "u1" };
      mockIamService.register.mockResolvedValue(result);

      await controller.register(req, res, next);

      expect(mockIamService.register).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Register success")
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next when dto invalid", async () => {
      const req = createMockRequest({
        body: {
          email: "invalid"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.register(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should call next when service throws error", async () => {
      const req = createMockRequest({
        body: {
          full_name: "Test User",
          email: "test@example.com",
          password: "123456",
          role: "student"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      mockIamService.register.mockRejectedValue(new Error("fail"));

      await controller.register(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  // ================= LOGIN =================
  describe("login", () => {
    it("should login successfully", async () => {
      const req = createMockRequest({
        body: {
          email_or_phone: "test@example.com",
          password: "123456"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const result = { access_token: "token" };
      mockIamService.login.mockResolvedValue(result);

      await controller.login(req, res, next);

      expect(mockIamService.login).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Login success")
      );
    });

    it("should call next when error", async () => {
      const req = createMockRequest({
        body: {
          email_or_phone: "test@example.com",
          password: "123456"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      mockIamService.login.mockRejectedValue(new Error("fail"));

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  // ================= GET ME =================
  describe("getMe", () => {
    it("should use x-user-id header", async () => {
      const req = createMockRequest({
        headers: { "x-user-id": "user-1" }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const result = { id: "user-1" };
      mockIamService.getMe.mockResolvedValue(result);

      await controller.getMe(req, res, next);

      expect(mockIamService.getMe).toHaveBeenCalledWith("user-1");
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Get me success")
      );
    });

    it("should fallback to mock-user-id", async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      const result = { id: "mock-user-id" };
      mockIamService.getMe.mockResolvedValue(result);

      await controller.getMe(req, res, next);

      expect(mockIamService.getMe).toHaveBeenCalledWith("mock-user-id");
    });
  });

  // ================= UPDATE PROFILE =================
  describe("updateProfile", () => {
    it("should update profile", async () => {
      const req = createMockRequest({
        headers: { "x-user-id": "user-1" },
        body: { full_name: "New Name" }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const result = { user_id: "user-1" };
      mockIamService.updateProfile.mockResolvedValue(result);

      await controller.updateProfile(req, res, next);

      expect(mockIamService.updateProfile).toHaveBeenCalledWith(
        "user-1",
        { full_name: "New Name" }
      );
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Update profile success")
      );
    });
  });

  // ================= PASSWORD RESET =================
  describe("requestPasswordReset", () => {
    it("should request reset", async () => {
      const req = createMockRequest({
        body: { email_or_phone: "test@example.com" }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const result = { request_id: "id" };
      mockIamService.requestPasswordReset.mockResolvedValue(result);

      await controller.requestPasswordReset(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Password reset OTP sent")
      );
    });
  });

  describe("verifyPasswordResetOtp", () => {
    it("should verify otp", async () => {
      const req = createMockRequest({
        body: {
          request_id: "id",
          otp_code: "1234"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const result = { status: "verified" };
      mockIamService.verifyPasswordResetOtp.mockResolvedValue(result);

      await controller.verifyPasswordResetOtp(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Password reset OTP verified")
      );
    });
  });

  describe("confirmPasswordReset", () => {
    it("should confirm reset", async () => {
      const req = createMockRequest({
        body: {
          reset_token: "token",
          new_password: "123456"
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const result = { status: "ok" };
      mockIamService.confirmPasswordReset.mockResolvedValue(result);

      await controller.confirmPasswordReset(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Password reset success")
      );
    });
  });

  // ================= LOGOUT =================
  describe("logout", () => {
    it("should logout", async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      const result = { status: "logged_out" };
      mockIamService.logout.mockResolvedValue(result);

      await controller.logout(req, res, next);

      expect(mockIamService.logout).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(
        ok(result, "Logout success")
      );
    });
  });
});