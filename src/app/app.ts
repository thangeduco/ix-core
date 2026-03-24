import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import { iamRoutes } from "../modules/iam/routes/iam.routes";
import { cccRoutes } from "../modules/ccc/routes/ccc.routes";
import { cgeRoutes } from "../modules/cge/routes/cge.routes";
import { lsmRoutes } from "../modules/lsm/routes/lsm.routes";
import { tewRoutes } from "../modules/tew/routes/tew.routes";
import { slpRoutes } from "../modules/slp/routes/slp.routes";
import { pseRoutes } from "../modules/pse/routes/pse.routes";
import { pltRoutes } from "../modules/plt/routes/plt.routes";

import { notFoundMiddleware } from "../shared/middleware/not-found.middleware";
import { errorMiddleware } from "../shared/middleware/error.middleware";

export const app = express();

const storagePath = path.join(process.cwd(), "storage");

app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(storagePath));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "iX-core healthy"
  });
});

app.use("/api/v1/iam", iamRoutes);
app.use("/api/v1/ccc", cccRoutes);
app.use("/api/v1/cge", cgeRoutes);
app.use("/api/v1/lsm", lsmRoutes);
app.use("/api/v1/tew", tewRoutes);
app.use("/api/v1/slp", slpRoutes);
app.use("/api/v1/pse", pseRoutes);
app.use("/api/v1/plt", pltRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);