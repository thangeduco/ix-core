"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const iam_routes_1 = require("../modules/iam/routes/iam.routes");
const ccc_routes_1 = require("../modules/ccc/routes/ccc.routes");
const cge_routes_1 = require("../modules/cge/routes/cge.routes");
const lsm_routes_1 = require("../modules/lsm/routes/lsm.routes");
const tew_routes_1 = require("../modules/tew/routes/tew.routes");
const slp_routes_1 = require("../modules/slp/routes/slp.routes");
const pse_routes_1 = require("../modules/pse/routes/pse.routes");
const plt_routes_1 = require("../modules/plt/routes/plt.routes");
const not_found_middleware_1 = require("../shared/middleware/not-found.middleware");
const error_middleware_1 = require("../shared/middleware/error.middleware");
exports.app = (0, express_1.default)();
const storagePath = path_1.default.join(process.cwd(), "storage");
exports.app.use((0, cors_1.default)());
exports.app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false
}));
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use("/static", express_1.default.static(storagePath));
exports.app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "iX-core healthy"
    });
});
exports.app.use("/api/v1/iam", iam_routes_1.iamRoutes);
exports.app.use("/api/v1/ccc", ccc_routes_1.cccRoutes);
exports.app.use("/api/v1/cge", cge_routes_1.cgeRoutes);
exports.app.use("/api/v1/lsm", lsm_routes_1.lsmRoutes);
exports.app.use("/api/v1/tew", tew_routes_1.tewRoutes);
exports.app.use("/api/v1/slp", slp_routes_1.slpRoutes);
exports.app.use("/api/v1/pse", pse_routes_1.pseRoutes);
exports.app.use("/api/v1/plt", plt_routes_1.pltRoutes);
exports.app.use(not_found_middleware_1.notFoundMiddleware);
exports.app.use(error_middleware_1.errorMiddleware);
