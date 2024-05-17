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
    replies: [
      {
        user: {
          name: String,
          username: String,
          id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
          },
        },
        text: String,
        created: Date,
      },
    ],

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
