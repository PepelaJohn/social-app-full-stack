import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    isGroup: {
      type: Boolean,
      default: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: "",
    },
    participants: {
      type: [mongoose.Types.ObjectId],

      ref: "User",
    },
    messages: {
      type: [mongoose.Types.ObjectId],
      ref: "Message",
      default: [],
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

export default mongoose.model("Group", groupSchema);
