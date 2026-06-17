import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    targetAmount: {
      type: Number,
      required: true,
    },

    currentAmount: {
      type: Number,
      default: 0,
    },

    targetDate: {
      type: Date,
      required: true,
    },

    color: {
      type: String,
      default: "#2563EB",
    },
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.model(
  "Goal",
  goalSchema
);

export default Goal;