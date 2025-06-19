import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import trendsRouter from "./api/trends.js";

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api", trendsRouter);

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
