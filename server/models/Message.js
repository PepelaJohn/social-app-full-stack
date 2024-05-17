import mongoose from "mongoose";
const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
    },
    groupId: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
      default: "",
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    text: String,
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
