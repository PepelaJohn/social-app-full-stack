import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
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
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: "User",
    },
    following: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: "User",
    },
    bio: {
      type: String,
      default: "",
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: "",
    },
    saves: {
      type: [mongoose.Types.ObjectId],
      ref: "Post",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

var User = mongoose.model("User", userSchema);
export default User;
