/**@type {import("express").RequestHandler"} */
/**@type {import("express").Response"} */
import express from "express";

import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import mongoose from "mongoose";
const router = express.Router();

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPosts = async (req, res) => {
  // console.log(req.query, "jskd");
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  console.log("creating");
  const { creator, title, file } = req?.body;
  const _id = req._id;

  const postCreator = {
    name: creator,
    creatorId: _id,
  };
  try {
    const newPost = new Post({ creator: postCreator, title, file });
    const saved = await newPost.save();
    // console.log(saved);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const likeUnlikePost = async (req, res) => {
  const userLikingId = req._id;
  const postId = req.params.postId;

  if (!postId) return res.status(401).json({ message: "Unauthorized" });

  if (!postId || !userLikingId) return res.sendStatus(400);

  try {
    const postToLike = await Post.findOne({ _id: postId });

    if (!postToLike) return res.sendStatus(400);

    const hasLiked = postToLike.likes.includes(userLikingId);

    if (hasLiked) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userLikingId } });

      const post = await Post.findOne({ _id: postId });

      return res.status(200).json(post._doc);
    } else {
      postToLike.likes.push(userLikingId);
      const responsePost = await postToLike.save();
      return res.status(200).json(responsePost._doc);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const replyToPost = async (req, res) => {
  const { text,name, parent } = req.body;

  const replyingUserId = req._id;
  const replyingUserName = req.username;
  const postId = req.params.postId;
  if (!name || !replyingUserId || !text || !postId || !replyingUserName)
    return res.status(400).json({ message: "Bad request" });

  try {
    let currentPost;
    if (parent === "comment") {
      currentPost = await Comment.findOne({ _id: postId });
      if (!currentPost)
        return res.status(404).json({ message: "No post found" });
    } else {
      currentPost = await Post.findOne({ _id: postId });
      if (!currentPost)
        return res.status(404).json({ message: "No post found" });
    }

    // const reply = {
    //   user: {
    //     name: name,
    //     username: replyingUserName,
    //     id: replyingUserId,
    //     created: new Date(),
    //   },
    //   text: text,
    // };
    // // console.log(new Date())

    const comment = new Comment({
      parentId: postId,
      user: {
        name: name,
        username: replyingUserName,
        id: replyingUserId,
      },
      text,
    });
    await comment.save();
    let post;
    currentPost.replies.unshift(comment._id);
    console.log(currentPost.replies);
    post = await currentPost.save()

    
    parent === "comment" && (post = {});
    return res.status(201).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const retweetPost = async (req, res) => {
  // console.log('entering', req.body, req._id);
  const { postId, currentCreator } = req?.body;
  const _id = req._id;
  if (!postId || !currentCreator || !_id)
    return res.status(400).json({ message: "Bad Request" });
  try {
    const postToRetweet = await Post.findOne({ _id: postId });
    // console.log(postToRetweet, "retweetpost after posttoretweet");
    const { title, file } = postToRetweet;
    const creator = {
      name: currentCreator,
      creatorId: _id,
    };

    const retweetPost = new Post({
      creator: creator,
      title,
      file,
      isRetweet: true,
    });

    postToRetweet.retweets.push(_id);
    await postToRetweet.save();
    const saved = await retweetPost.save();

    return res.status(200).json(saved);
  } catch (error) {
    console.log(error, "retweet post controller");
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const _id = req._id;
  if (!postId || !_id) return res.status(403).json({ message: "Forbidden" });
  try {
    const postToDelete = await Post.findOne({ _id: postId });
    if (!postToDelete) return res.status(404).json({ message: "Not Found" });
    // console.log(postToDelete.creator.creatorId, _id);
    if (postToDelete.creator.creatorId.toString() !== _id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    await Post.findByIdAndDelete(postId);
    return res.status(200).json(postToDelete._id);
  } catch (error) {
    console.log(error.message, "deletePost controller");
    return res.status(500).json({ message: error.message });
  }
};

export const getFeed = async (req, res) => {
  const _id = req._id;
  if (!_id) return res.status(204).json([]);

  try {
    const user = await User.findById(_id);
    if (!user) return res.status(204).json([]);

    const feedPosts = await Post.find({
      $or: [
        { "creator.creatorId": { $in: user.following } },
        { _id: { $in: user.saves } },
      ],
    }).limit(10);
    if (feedPosts.length < 1) {
      const otherPosts = await Post.find().sort("createdAt").limit(10);
      return res.status(200).json(otherPosts);
    }

    return res.status(200).json(feedPosts);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getProfilePosts = async (req, res) => {
  const userId = req.params.id;
  console.log("passing through getprofileposts");
  if (!userId) return res.status(401).json({ message: "Bad Request" });
  try {
    const profilePosts = await Post.find({ "creator.creatorId": userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json(profilePosts);
  } catch (error) {
    console.log("error in the getprofileposts", error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const getSavedPosts = async (req, res) => {
  const userId = req._id;
  console.log("passing through getsaved", userId);
  if (!userId) return res.status(401).json({ message: "Bad Request" });
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "No user found" });
    const savedPosts = await Post.find({ _id: { $in: user.saves } }).sort({
      createdAt: -1,
    });
    return res.status(200).json(savedPosts);
  } catch (error) {
    console.log("error in the getsavedposts", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  const { parentId } = req.params;
  if (!parentId || !mongoose.isValidObjectId(parentId)) return res.status(400);

  try {
    const comments = await Comment.find({ parentId }).populate({
      path: "user.id",
      select: "profilePic",
      model: "User",
    });
    return res.status(200).json(comments);
  } catch (error) {
    console.log("error in the getsavedposts", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export default router;
