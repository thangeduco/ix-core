"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
function ok(data, message = "OK") {
    return {
        success: true,
        message,
        data
    };
}
