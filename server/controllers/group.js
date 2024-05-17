import express from "express";
import User from "../models/User.js";
import Group from "../models/Group.js";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import { getRecipientSokcetId, io } from "../socket/socket.js";
const router = express.Router();

function isValidUsers(users) {
  let isValid = true;
  users.map((user) => {
    if (!mongoose.isValidObjectId(user)) {
      isValid = false;
      return;
    }
  });

  return isValid;
}

export const createGroup = async (req, res) => {
  const _id = req._id;
  const { groupName, groupDescription, participants } = req?.body;
  if (!_id) return res.status(400).json({ message: "Bad request" });

  try {
    if (!isValidUsers([...participants, _id]))
      return res.status(400).json({ message: "Invalid users" });
    const group = new Group({
      creator: _id,
      name: groupName,
      participants: [_id, ...participants],
      messages: [],
    });

    // group.$isValid

    if (!!groupDescription) group.description = groupDescription;

    await group.save();

    return res.status(201).json(group);
  } catch (error) {
    console.log(error.message, "creategoup");
    return res.status(500).json({ message: error.message });
  }
};

export const addParticipantToGroup = async (req, res) => {
  const _id = req._id;
  const userId = req?.body;

  const { groupId } = req.params;

  if ((!_id, !groupId, !userId.length))
    return res.status(400).json({ message: "Bad Request" });
  try {
    if (!mongoose.isValidObjectId(groupId)) return res.sendStatus(400);
    const group = await Group.findById(groupId);

    if (!group) return res.sendStatus(404);
    console.log(group.creator.toString(), _id.toString());
    if (group.creator.toString() !== _id)
      return res
        .status(403)
        .json({ message: "Only admins can add users to groups" });
    let status;
    for (const user of userId) {
      if (group.participants.includes(user)) status = status || 204;
      else {
        group.participants.unshift(user);
        status = 200;
      }
    }

    await group.save();
    return res.status(status).json(group);
  } catch (error) {
    console.log(error.message, "creategoupmessage");
    return res.status(500).json({ message: error.message });
  }
};

export const createGroupMessage = async (req, res) => {
  const _id = req._id;
  const { groupId } = req.params;
  const message = req.body; // message = { sender, text, ?img}
  if (
    !_id ||
    !Object.keys(message).length ||
    !(message?.text || message.img) ||
    !message.sender ||
    !groupId
  )
    return res.status(400).json({ message: "Bad request" });
  try {
    const groupToUpdate = await Group.findById(groupId);
    if (!groupToUpdate)
      return res.status(404).json({ message: "Group Not Found" });

    const { sender, text, img } = message;
    const newMessage = new Message({
      sender,
      text,
      groupId,
    });

    if (!!img) newMessage.img = img;

    groupToUpdate.messages.push(newMessage._id);
    groupToUpdate.lastMessage = {
      text: text,
      sender: _id,
      seen: false,
    };

    await Promise.all([newMessage.save(), groupToUpdate.save()]);

    const receipientSocketId = getRecipientSokcetId(groupToUpdate.participants);

    const msg = await Message.findOne({ _id: newMessage._id })
      .populate({
        path: "sender",
        select: "name profilePic",
      })
      
    receipientSocketId.length &&
      io.to(receipientSocketId).emit("newGroupMessage", msg);

    return res.status(200).json({ message: msg, conversation: groupToUpdate });
  } catch (error) {
    console.log(error.message, "creategroupmessage");
    return res.status(500).json({ message: error.message });
  }
};

export const getGroupMessages = async (req, res) => {
  const _id = req._id;
  const { id } = req.params;
  if (!id || !id) return res.status(400).json({ message: "Bad Request" });
  try {
    const group = await Group.findById(id);
    console.log(id, "jdkflsdjflkajdf");
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!group.participants.includes(_id))
      return res.status(401).json({ message: "Unauthorized" });

    const messages = await Message.find({ groupId: id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.log(error.message, "getgroupmessage");
    return res.status(500).json({ message: error.message });
  }
};

export default router;
