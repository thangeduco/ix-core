"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = notFoundMiddleware;
function notFoundMiddleware(req, res, next) {
    res.status(404).json({
        success: false,
        message: "API not found"
    });
}
