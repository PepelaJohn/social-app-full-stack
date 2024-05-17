import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  
  try {
    const access_token = req.cookies?.access_token 

    if (!access_token)
      return res.status(403).json({ message: "No permission" });
    jwt.verify(access_token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) return res.status(403).json({ message: "forbiden" });

      req.username = decoded.username;
      req._id = decoded._id;

      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
