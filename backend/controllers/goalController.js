import Goal from "../models/Goal.js";

export const createGoal = async (
  req,
  res
) => {
  try {
    const goal =
      await Goal.create({
        ...req.body,
        user: req.user.id,
      });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getGoals = async (
  req,
  res
) => {
  try {
    const goals =
      await Goal.find({
        user: req.user.id,
      });

    res.json(goals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateGoal = async (
  req,
  res
) => {
  try {
    const goal =
      await Goal.findById(
        req.params.id
      );

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    const updated =
      await Goal.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteGoal = async (
  req,
  res
) => {
  try {
    const goal =
      await Goal.findById(
        req.params.id
      );

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    await goal.deleteOne();

    res.json({
      message: "Goal deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};