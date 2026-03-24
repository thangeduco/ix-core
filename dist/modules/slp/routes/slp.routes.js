"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slpRoutes = void 0;
const express_1 = require("express");
const slp_controller_1 = require("../controllers/slp.controller");
const controller = new slp_controller_1.SlpController();
exports.slpRoutes = (0, express_1.Router)();
exports.slpRoutes.get("/health", (req, res) => {
    res.json({ module: "slp", ok: true });
});
exports.slpRoutes.post("/rankings/calculate", controller.calculateRanking.bind(controller));
exports.slpRoutes.get("/rankings", controller.getRanking.bind(controller));
exports.slpRoutes.get("/rankings/compare", controller.compareRanking.bind(controller));
