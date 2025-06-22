import "./config/loadEnv.js";
import express from "express";
import cors from "cors";

import trendsRouter from "./api/trends.js";
import briefsRouter from "./api/briefs.js";

const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3002",
      "http://localhost:3004",
    ],
  })
);
app.use(express.json());

app.use("/api", trendsRouter);
app.use("/api", briefsRouter);

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
