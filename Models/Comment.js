import mongoose from "mongoose";
import { Schema } from "mongoose";

const Comment = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Object, required: true },
});

export default mongoose.model("Comment", Comment);
