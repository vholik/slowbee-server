import jwt from "jsonwebtoken";
import User from "../Models/User.js";

export default async function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "User is not authorized" });
    }
    const decodedData = jwt.verify(token, "SECRET_KEY");
    const { id } = decodedData;
    const user = await User.findById(id);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "User is not authorized" });
  }
}
