import bcrypt from "bcryptjs";
import User from "../Models/User.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, "SECRET_KEY", { expiresIn: "24h" });
};

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Registration error", errors });
      }
      const { username, password } = req.body;
      const findUser = await User.findOne({ username });
      if (findUser) {
        return res
          .status(400)
          .json({ message: `User ${username} exists`, errors });
      }
      const hashPassword = bcrypt.hashSync(password, 6);
      const user = new User({ username, password: hashPassword });
      await user.save();
      return res.json({ message: `User ${username} succesfully registered` });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: `User ${username} has not found` });
      }
      const userInfo = {
        id: user._id,
        username: user.username,
      };
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Incorrect password` });
      }
      const token = generateAccessToken(user._id);
      res.json({ token, user: userInfo });
    } catch (error) {}
  }
}

export default new AuthController();
