import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import type { ErrorRequestHandler } from "express";
import swaggerUi from "swagger-ui-express";
import routerTest from "./routes/health";
import { swaggerSpec } from "./swagger";

const app = express();

if (process.env.CLIENT_URL != null) {
  app.use(cors({ origin: [process.env.CLIENT_URL] }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.text());
// app.use(express.raw());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routerTest);

const publicFolderPath = path.join(__dirname, "../../server/public");

if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

const clientBuildPath = path.join(__dirname, "../../client/dist");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get("*", (_, res) => {
    res.sendFile("index.html", { root: clientBuildPath });
  });
}

const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  console.error("on req:", req.method, req.path);

  next(err);
};

app.use(logErrors);

export default app;
