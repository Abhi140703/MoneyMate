import Budget from "../models/Budget.js";

export const createBudget = async (
  req,
  res
) => {
  try {
    const budget =
      await Budget.create({
        ...req.body,
        spent: req.body.spent || 0,
        user: req.user.id,
      });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBudgets = async (
  req,
  res
) => {
  try {
    const budgets = await Budget.find({
  user: req.user.id,
});

    res.json(budgets);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBudget = async (
  req,
  res
) => {
  try {
    const budget =
      await Budget.findById(
        req.params.id
      );

    if (!budget) {
      return res.status(404).json({
        message:
          "Budget not found",
      });
    } 
    if (
  budget.user.toString() !==
  req.user.id
) {
  return res.status(403).json({
    message: "Unauthorized",
  });
}

    const updated =
      await Budget.findByIdAndUpdate(
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

export const deleteBudget = async (
  req,
  res
) => {
  try {
    const budget =
      await Budget.findById(
        req.params.id
      );

    if (!budget) {
      return res.status(404).json({
        message:
          "Budget not found",
      });
    }
    if (
  budget.user.toString() !==
  req.user.id
) {
  return res.status(403).json({
    message: "Unauthorized",
  });
}

    await budget.deleteOne();

    res.json({
      message:
        "Budget deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};