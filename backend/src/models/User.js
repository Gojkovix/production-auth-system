import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    emailVerified: { type: Boolean, default: false },

    verifyEmailTokenHash: { type: String, default: null },
    verifyEmailTokenExp: { type: Date, default: null },

    resetPasswordTokenHash: { type: String, default: null },
    resetPasswordTokenExp: { type: Date, default: null },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", UserSchema);
