import mongoose, { Schema } from "mongoose";
const conversationSchema = new Schema(
  {
    isGroup: {
      type:Boolean,
      default: false,
    },
    participants: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
    },
    lastMessage: {
      text: String,
      sender: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      seen: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
