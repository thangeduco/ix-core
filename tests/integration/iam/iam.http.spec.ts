import express from "express";
import request from "supertest";

// ===== MOCK SERVICE =====
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

jest.mock("../../../src/modules/iam/services/iam.service", () => {
  return {
    IamService: jest.fn().mockImplementation(() => mockIamService)
  };
});

// Import sau khi mock
import { iamRoutes } from "../../../src/modules/iam/routes/iam.routes";

describe("IAM HTTP Integration Test", () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use("/iam", iamRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ================= HEALTH =================
  it("GET /iam/health", async () => {
    const res = await request(app).get("/iam/health");

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  // ================= REGISTER =================
  it("POST /iam/auth/register", async () => {
    mockIamService.register.mockResolvedValue({ id: "u1" });

    const res = await request(app).post("/iam/auth/register").send({
      full_name: "Test User",
      email: "test@example.com",
      password: "123456",
      role: "student"
    });

    expect(res.status).toBe(201);
    expect(mockIamService.register).toHaveBeenCalledTimes(1);
    expect(res.body.data.id).toBe("u1");
  });

  // ================= LOGIN =================
  it("POST /iam/auth/login", async () => {
    mockIamService.login.mockResolvedValue({
      access_token: "token"
    });

    const res = await request(app).post("/iam/auth/login").send({
      email_or_phone: "test@example.com",
      password: "123456"
    });

    expect(res.status).toBe(200);
    expect(res.body.data.access_token).toBe("token");
  });

  // ================= GET ME =================
  it("GET /iam/me", async () => {
    mockIamService.getMe.mockResolvedValue({
      id: "user-1"
    });

    const res = await request(app)
      .get("/iam/me")
      .set("x-user-id", "user-1");

    expect(res.status).toBe(200);
    expect(mockIamService.getMe).toHaveBeenCalledWith("user-1");
  });

  // ================= UPDATE PROFILE =================
  it("PUT /iam/me/profile", async () => {
    mockIamService.updateProfile.mockResolvedValue({
      user_id: "user-1"
    });

    const res = await request(app)
      .put("/iam/me/profile")
      .set("x-user-id", "user-1")
      .send({
        full_name: "New Name"
      });

    expect(res.status).toBe(200);
    expect(mockIamService.updateProfile).toHaveBeenCalledWith(
      "user-1",
      { full_name: "New Name" }
    );
  });

  // ================= PASSWORD RESET =================
  it("POST /iam/auth/password-reset/request", async () => {
    mockIamService.requestPasswordReset.mockResolvedValue({
      request_id: "req1"
    });

    const res = await request(app)
      .post("/iam/auth/password-reset/request")
      .send({
        email_or_phone: "test@example.com"
      });

    expect(res.status).toBe(200);
    expect(res.body.data.request_id).toBe("req1");
  });

  it("POST /iam/auth/password-reset/verify", async () => {
    mockIamService.verifyPasswordResetOtp.mockResolvedValue({
      status: "verified"
    });

    const res = await request(app)
      .post("/iam/auth/password-reset/verify")
      .send({
        request_id: "req1",
        otp_code: "1234"
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("verified");
  });

  it("POST /iam/auth/password-reset/confirm", async () => {
    mockIamService.confirmPasswordReset.mockResolvedValue({
      status: "success"
    });

    const res = await request(app)
      .post("/iam/auth/password-reset/confirm")
      .send({
        reset_token: "token",
        new_password: "123456"
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("success");
  });

  // ================= LOGOUT =================
  it("POST /iam/auth/logout", async () => {
    mockIamService.logout.mockResolvedValue({
      status: "logged_out"
    });

    const res = await request(app)
      .post("/iam/auth/logout")
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("logged_out");
  });

  // ================= VALIDATION ERROR =================
  it("should return 400 when DTO invalid", async () => {
    const res = await request(app)
      .post("/iam/auth/register")
      .send({
        email: "invalid" // thiếu field bắt buộc
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});