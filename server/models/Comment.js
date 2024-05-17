import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    parentId: mongoose.Types.ObjectId,
    user: {
      name: String,
      username: String,
      id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    },
    text: String,
    img: {
      type: String,
      default: "",
    },
    replies: {
      type: [mongoose.Types.ObjectId],
      ref: "Comment",
      default:[]
    },
   
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema)
