import mongoose from "mongoose";
import { Schema } from "mongoose";

const Track = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  length: { type: Number, required: true },
  cover: { type: String, required: true },
  audio: { type: String, required: true },
  listens: { type: Number, default: 0 },
  comments: [{ type: Object, ref: "Comment" }],
});

export default mongoose.model("Track", Track);
