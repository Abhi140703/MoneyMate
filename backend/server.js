import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(
  "/api/transactions",
  transactionRoutes
);
app.use(
  "/api/budgets",
  budgetRoutes
);
app.use(
  "/api/goals",
  goalRoutes
);
app.use(
  "/api/loans",
  loanRoutes
);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server Running on ${process.env.PORT}`
  );
});