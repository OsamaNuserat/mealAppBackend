import mongoose, { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    pic: {
      type: Object,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    resetPasswordToken: { 
        type: String,
        default:null
    },
    changepasswordtime : {
      type:Date,
    },
    wishlist:{
      type:[{
        type:Schema.Types.ObjectId,
        ref:'Category'
      }]
    }
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
