export const verifyPermission = (req, res, next) => {
  
  if (!(req.username || req._id)) {
    return res.status(401).json({ message: "Forbiden" });
  } else next();
};
