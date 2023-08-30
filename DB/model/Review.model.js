import mongoose, { Schema, Types, model } from "mongoose";
const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

  },
  {
    timestamps: true,
  }
);
const reviewModel = mongoose.models.Review || model("Review", reviewSchema);
export default reviewModel;
