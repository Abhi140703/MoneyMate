import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createGoal
);

router.get(
  "/",
  protect,
  getGoals
);

router.put(
  "/:id",
  protect,
  updateGoal
);

router.delete(
  "/:id",
  protect,
  deleteGoal
);

export default router;