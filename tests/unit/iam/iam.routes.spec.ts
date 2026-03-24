import express, { Request, Response } from "express";
import request from "supertest";

// Mock handlers cho từng method của controller
const mockRegister = jest.fn((req: Request, res: Response) => {
  res.status(201).json({ ok: true, api: "register" });
});

const mockLogin = jest.fn((req: Request, res: Response) => {
  res.status(200).json({ ok: true, api: "login" });
});

const mockRequestPasswordReset = jest.fn((req: Request, res: Response) => {
  res.status(200).json({ ok: true, api: "requestPasswordReset" });
});

const mockVerifyPasswordResetOtp = jest.fn((req: Request, res: Response) => {
  res.status(200).json({ ok: true, api: "verifyPasswordResetOtp" });
});

const mockConfirmPasswordReset = jest.fn((req: Request, res: Response) => {
  res.status(200).json({ ok: true, api: "confirmPasswordReset" });
});

const mockLogout = jest.fn((req: Request, res: Response) => {
  res.status(200).json({ ok: true, api: "logout" });
});

const mockGetMe = jest.fn((req: Request, res: Response) => {
  res.status(200).json({ ok: true, api: "getMe" });
});

const mockUpdateProfile = jest.fn((req: Request, res: Response) => {
  res.status(200).json({ ok: true, api: "updateProfile" });
});

// Mock IamController đúng theo cấu trúc thư mục của bạn
jest.mock("../../../src/modules/iam/controllers/iam.controller", () => {
  return {
    IamController: jest.fn().mockImplementation(() => ({
      register: mockRegister,
      login: mockLogin,
      requestPasswordReset: mockRequestPasswordReset,
      verifyPasswordResetOtp: mockVerifyPasswordResetOtp,
      confirmPasswordReset: mockConfirmPasswordReset,
      logout: mockLogout,
      getMe: mockGetMe,
      updateProfile: mockUpdateProfile
    }))
  };
});

// Import routes sau khi đã mock controller
import { iamRoutes } from "../../../src/modules/iam/routes/iam.routes";

describe("iam.routes smoke test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/iam", iamRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /iam/health", () => {
    it("should return health response", async () => {
      const res = await request(app).get("/iam/health");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        module: "iam",
        ok: true
      });
    });
  });

  describe("POST /iam/auth/register", () => {
    it("should call controller.register", async () => {
      const payload = {
        email: "test@example.com",
        password: "123456"
      };

      const res = await request(app).post("/iam/auth/register").send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        ok: true,
        api: "register"
      });
      expect(mockRegister).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /iam/auth/login", () => {
    it("should call controller.login", async () => {
      const payload = {
        email: "test@example.com",
        password: "123456"
      };

      const res = await request(app).post("/iam/auth/login").send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ok: true,
        api: "login"
      });
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /iam/auth/password-reset/request", () => {
    it("should call controller.requestPasswordReset", async () => {
      const payload = {
        email: "test@example.com"
      };

      const res = await request(app)
        .post("/iam/auth/password-reset/request")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ok: true,
        api: "requestPasswordReset"
      });
      expect(mockRequestPasswordReset).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /iam/auth/password-reset/verify", () => {
    it("should call controller.verifyPasswordResetOtp", async () => {
      const payload = {
        email: "test@example.com",
        otp: "123456"
      };

      const res = await request(app)
        .post("/iam/auth/password-reset/verify")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ok: true,
        api: "verifyPasswordResetOtp"
      });
      expect(mockVerifyPasswordResetOtp).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /iam/auth/password-reset/confirm", () => {
    it("should call controller.confirmPasswordReset", async () => {
      const payload = {
        email: "test@example.com",
        otp: "123456",
        newPassword: "new-password"
      };

      const res = await request(app)
        .post("/iam/auth/password-reset/confirm")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ok: true,
        api: "confirmPasswordReset"
      });
      expect(mockConfirmPasswordReset).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /iam/auth/logout", () => {
    it("should call controller.logout", async () => {
      const res = await request(app).post("/iam/auth/logout").send({});

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ok: true,
        api: "logout"
      });
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /iam/me", () => {
    it("should call controller.getMe", async () => {
      const res = await request(app).get("/iam/me");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ok: true,
        api: "getMe"
      });
      expect(mockGetMe).toHaveBeenCalledTimes(1);
    });
  });

  describe("PUT /iam/me/profile", () => {
    it("should call controller.updateProfile", async () => {
      const payload = {
        fullName: "Dao Duc Thang"
      };

      const res = await request(app).put("/iam/me/profile").send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ok: true,
        api: "updateProfile"
      });
      expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
    });
  });
});