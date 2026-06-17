import Loan from "../models/Loan.js";

export const createLoan = async (
  req,
  res
) => {
  try {
    const loan =
      await Loan.create({
        ...req.body,
        user: req.user.id,
      });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getLoans = async (req, res) => {
  try {
   const loans = await Loan.find({
  user: req.user.id,
});
    res.json(loans);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateLoan = async (
  req,
  res
) => {
  try {
    const loan =
      await Loan.findById(
        req.params.id
      );

    if (!loan) {
      return res.status(404).json({
        message: "Loan not found",
      });
    }
    if (
  loan.user.toString() !==
  req.user.id
) {
  return res.status(403).json({
    message: "Unauthorized",
  });
}

    const updated =
      await Loan.findByIdAndUpdate(
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

export const deleteLoan = async (
  req,
  res
) => {
  try {
    const loan =
      await Loan.findById(
        req.params.id
      );

    if (!loan) {
      return res.status(404).json({
        message: "Loan not found",
      });
    }
    if (
  loan.user.toString() !==
  req.user.id
) {
  return res.status(403).json({
    message: "Unauthorized",
  });
}

    await loan.deleteOne();

    res.json({
      message: "Loan deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};