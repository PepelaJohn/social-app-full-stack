import jwt from "jsonwebtoken";
import User from "../models/User.js";
import express from "express";
const router = express.Router();
import mongoose from "mongoose";
export async function refreshToken(req, res) {
  const refresh_token = req?.cookies?.refresh_token;
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId) || !userId)
    return res.status(403).json({ message: "No permissions to access this" });
  let username;
  let _id;
  let name;
  try {
    // console.log(userId);
    const validUser = await User.findOne({ _id: userId });
    if (!validUser)
      return res.status(403).json({ message: "Please login again" });
    const userToken = validUser.refreshToken;
    if (!userToken)
      return res.status(403).json({ message: "Please login again" });

    const validToken = userToken?.toString() === refresh_token.toString();

    // console.log(refresh_token, validToken, userToken);
    if (!validToken) return res.status(403).json({ message: "No permission" });
    if (!refresh_token)
      return res
        .status(403)
        .json({ message: "You do not have the rights to access this" });
    jwt.verify(refresh_token, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ message: "You do not have the rights to access this" });
      username = decoded.username;
      _id = decoded._id;
      name = decoded.name;
      
      const access_token = jwt.sign(
        { _id, username, name:validUser.name },
        process.env.ACCESS_TOKEN
      );

      return res
        .cookie("access_token", access_token, {
          httpOnly: false,
          maxAge: 60 * 1000,
        })
        .sendStatus(204);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

export default router;
