"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    PORT: Number(process.env.PORT || 3000),
    NODE_ENV: process.env.NODE_ENV || "development",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: Number(process.env.DB_PORT || 5432),
    DB_NAME: process.env.DB_NAME || "ix",
    DB_USER: process.env.DB_USER || "ix",
    DB_PASSWORD: process.env.DB_PASSWORD || "ix"
};
