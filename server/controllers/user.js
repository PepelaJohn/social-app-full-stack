import express from "express";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Post from "../models/Post.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import { getRecipientSokcetId, io } from "../socket/socket.js";
import Group from "../models/Group.js";
const router = express.Router();

export const authUser = async (req, res) => {
  const { name, email, username, password } = req?.body;
  const isSignUp = req.params.page === "sign-up";
  const isSignIn = req.params.page === "sign-in";
  const isSignOut = req.params.page === "sign-out";

  if (
    (isSignUp && (!username || !email || !password || !name)) ||
    (isSignIn && !(username || email) && !password)
  )
    return res.status(400).json({ message: "Input all the credentials" });

  try {
    let currentUser;
    if (isSignUp) {
      const user = await User.findOne({ $or: [{ email }, { username }] });
      if (user)
        return res.status(400).json({ message: "Existing Account found" });

      const hashedPassword = bcryptjs.hashSync(password, 10);

      currentUser = new User({
        name,
        email,
        username,
        password: hashedPassword,
      });
      const refreshToken = jwt.sign(
        { _id: currentUser._id, username, name },
        process.env.REFRESH_TOKEN
      );

      currentUser.refreshToken = refreshToken;

      await currentUser.save();
    } else if (isSignIn) {
      currentUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (!currentUser)
        return res.status(404).json({ message: "User not found" });

      let refreshToken = currentUser.refreshToken;
      if (!refreshToken) {
        refreshToken = jwt.sign(
          { _id: currentUser._id, username, name: name },
          process.env.REFRESH_TOKEN
        );
        currentUser.refreshToken = refreshToken;
        await currentUser.save();
      }

      const validPwd = bcryptjs.compareSync(password, currentUser.password);
      if (!validPwd)
        return res.status(401).json({ message: "Wrong credentials" });
    } else if (isSignOut) {
      const { id } = req?.body;

      currentUser = await User.findOne({ _id: id });
      if (!currentUser) return res.status(403).json({ message: "Forbidden" });

      currentUser.refreshToken = "";
      await currentUser.save();
      res.cookie("access_token", "");
      res.cookie("refresh_token", "", { path: "/refresh" });

      return res.status(200).json({ message: "Logged out" });
    }

    const access_token = jwt.sign(
      {
        _id: currentUser._id,
        username: currentUser.username,
        name: currentUser.name,
      },
      process.env.ACCESS_TOKEN
    );
    // const expires = new Date(Date.now() + 3600000 * 24 * 7);

    const {
      password: hashed,
      refreshToken,
      isfrozen,
      ...rest
    } = currentUser._doc;
    const status = isSignIn ? 200 : 201;

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      sameSite: "strict",
      secure: true,
      path: "/refresh",
      priority: "high",
    });

    return res
      .cookie("access_token", access_token, {
        httpOnly: false,
        maxAge: 60 * 1000,
      })
      .status(status)
      .json({ ...rest });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const _id = req.params.id;
  if (!_id) return res.status(400).json({ message: "Bad Request" });

  try {
    const foundUser = await User.findOne({ _id });
    if (!foundUser) return res.status(404).json({ message: "User not Found" });

    if (foundUser.isFrozen) {
      return res.status(200).json({ _id: foundUser._id, isFrozen: true });
    }
    const { password, isFrozen, refreshToken, ...rest } = foundUser._doc;

    return res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getFollowers = async (req, res) => {
  const _id = req._id;
  try {
    const user = await User.findOne({ _id }).populate({
      path: "following",
      select: "name profilePic",
    });
    if (!user) return res.status(404).json({ message: "user not found" });

    return res.status(200).json({ following: user.following });
  } catch (error) {
    console.log(error.message, "getfollwers");
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const _id = req._id;

  const { name, email, username, profilePic, bio } = req.body;

  if (!_id) return res.status(421).json({ message: "Unavailable" });

  if (name && email && username && profilePic && bio)
    return res.sendStatus(200);
  try {
    const userToUpdate = await User.findOne({ _id });
    if (!userToUpdate) return res.status(400).json({ message: "Bad request" });

    if (req.body.password) {
      const hashedPwd = bcryptjs.hashSync(password, 10);
      userToUpdate.password = hashedPwd;
    }

    userToUpdate.name = name || userToUpdate.name;
    userToUpdate.email = email || userToUpdate.email;
    userToUpdate.username = username || userToUpdate.username;
    userToUpdate.profilePic = profilePic || userToUpdate.profilePic;
    userToUpdate.bio = bio || userToUpdate.bio;

    const user = await userToUpdate.save();

    const { password, refreshToken, isFrozen, ...rest } = user._doc;

    return res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const savePost = async (req, res) => {
  const { postId } = req.body;
  const _id = req._id;

  if (!postId || !_id) return res.status(400).json({ message: "Bad Request" });
  try {
    {
      const user = await User.findOne({ _id });
      const post = await Post.findOne({ _id: postId });
      if (!user || !post)
        return res.status(404).json({ message: "User Not found" });
      user.saves.push(postId);
      await user.save();

      const hasSaved = post.saves.includes(_id);
      if (hasSaved) {
        await Post.updateOne({ _id: postId }, { $pull: { saves: _id } });

        const savedPost = await Post.findOne({ _id: postId });
        // console.log(post._doc);
        return res.status(200).json({ savedPost: savedPost._doc, user });
      } else {
        post.saves.push(_id);
        const savedPost = await post.save();
        return res.status(200).json({ savedPost, user });
      }
    }
  } catch (error) {
    console.log(error, "savepostusercontroller user");
    return res.status(500).json({ message: error.message });
  }
};

export const followUnfollow = async (req, res) => {
  const userfollowingId = req._id;
  const userToFollowId = req.params.id;

  if (
    (!userToFollowId && !userfollowingId) ||
    userToFollowId?.toString() === userfollowingId?.toString()
  )
    return res.status(400).json({ message: "Bad Request" });
  try {
    const userToFollow = await User.findOne({ _id: userToFollowId });
    const userFollowing = await User.findOne({ _id: userfollowingId });

    if (!userToFollow && !userFollowing)
      return res.status(404).json({ message: "User Not Found" });
    // console.log(userToFollow.username, userFollowing.username);

    const hasFollowed =
      userToFollow.followers.includes(userfollowingId) ||
      userFollowing.following.includes(userToFollowId);

    if (hasFollowed) {
      await User.updateOne(
        {
          _id: userToFollowId,
        },
        { $pull: { followers: userfollowingId } }
      );
      await User.updateOne(
        {
          _id: userfollowingId,
        },
        {
          $pull: { following: userToFollowId },
        }
      );

      const followingUser = await User.findOne({ _id: userfollowingId });
      const followedUser = await User.findOne({ _id: userToFollowId });

      // console.log(followedUser, followingUser);
      return res.status(200).json({ followingUser, followedUser });
    } else {
      userToFollow.followers.unshift(userfollowingId);
      userFollowing.following.unshift(userToFollowId);
      const NewUserFollowing = await userFollowing.save();
      const NewUserToFollow = await userToFollow.save();
      const { refreshToken, password, isFrozen, ...rest1 } =
        NewUserFollowing._doc;
      const {
        refreshToken: h,
        password: x,
        isFrozen: q,
        ...rest2
      } = NewUserToFollow._doc;

      // console.log(rest1);
      return res
        .status(200)
        .json({ followingUser: rest1, followedUser: rest2 });
    }
  } catch (error) {
    console.log(error, "followunfollow user");
    return res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  const _id = req._id;
  if (!_id) return res.status(400).json({ message: "Bad Request" });
  try {
    const conversations = await Conversation.find({
      participants: _id,
    })
      .populate({
        path: "participants",
        select: "name profilePic",
      })
      .sort({ createdAt: -1 });
    const groups = await Group.find({
      participants: _id,
    })
      .populate({
        path: "participants",
        select: "name profilePic",
      })
      .sort({ createdAt: -1 });


    // console.log(conversations[0].participants[0]);
    // for (let conversation of conversations) {
    //   // console.log(conversation._id);
    //   const newpart = conversation.participants.filter(
    //     (participant) => participant._id.toString() !== _id.toString()
    //   );

    //   // conversation.participants = newpart
    //   console.log(conversation.participants, newpart);
    // }
    return res.status(200).json([...conversations, ...groups]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; //isGroup==='false'

export const getMessage = async (req, res) => {
  const id = req.params.id;
  const _id = req._id;
  const { isGroup } = req?.query;

  if (!id || !_id || !isGroup)
    return res.status(400).json({ message: "Bad Request" });

  try {
    if (isGroup === "false") {
      const conversation = await Conversation.findOne({
        participants: { $all: [id, _id] },
      });
      if (!conversation)
        return res.status(404).json({ message: "Conversation not found" });

      const messages = await Message.find({
        conversationId: conversation._id,
      }).sort({ createdAt: 1 });
      return res.status(200).json(messages);
    } else if (isGroup === "true") {
      const group = await Group.findById(id);
      // console.log(id, "jdkflsdjflkajdf");
      if (!group) return res.status(404).json({ message: "Group not found" });
      if (!group.participants.includes(_id))
        return res.status(401).json({ message: "Unauthorized" });

      const messages = await Message.find({ groupId: id }).sort({
        createdAt: 1,
      }).populate({path:'sender', populate:"name profilePic"})
      return res.status(200).json(messages);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createMessage = async (req, res) => {
  const _id = req._id;
  const { recepientId, text } = req?.body;

  if (!_id || !recepientId || !text)
    return res.status(400).json({ message: "Bad Request" });
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [recepientId, _id] },
    }).populate({
      path: "participants",
      select: "name profilePic",
    });

    // console.log(conversation);

    if (!conversation || !Object.keys(conversation).length) {
      conversation = new Conversation({
        participants: [_id, recepientId],
        lastMessage: {
          text,
          sender: _id,
        },
      });
      await conversation.save();
      conversation = await Conversation.findOne({
        participants: { $all: [recepientId, _id] },
      }).populate({
        path: "participants",
        select: "name profilePic",
      });
    } else {
      conversation.lastMessage = {
        text,
        sender: _id,
      };
    }

    const message = new Message({
      conversationId: conversation._id,
      sender: _id,
      text,
    });
    await message.save();
    await conversation.save();

    const receipientSocketId = getRecipientSokcetId(recepientId);
    console.log(receipientSocketId, "createchat recepientsocket");
    !!receipientSocketId &&
      io.to(receipientSocketId).emit("newMessage", message);

    return res.status(200).json({ message, conversation });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export default router;
