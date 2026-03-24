"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
function errorMiddleware(err, req, res, next) {
    console.error(err);
    res.status(err?.status || 500).json({
        success: false,
        message: err?.message || "Internal server error"
    });
}
