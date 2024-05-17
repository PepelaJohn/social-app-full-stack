import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    creator: {
      name: {
        type: String,
        required: true,
      },
      creatorId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    title: String,
    file: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: {
      type:[mongoose.Types.ObjectId],
      default:[],
      ref:'Comment'
    },

    retweets: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
        },
      },
    ],
    saves: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },

    isRetweet: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

var Post = mongoose.model("Post", postSchema);
export default Post;
