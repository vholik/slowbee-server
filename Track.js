import mongoose from "mongoose";

const Track = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  length: { type: Number, required: true },
  cover: { type: String, required: true },
  audio: { type: String, required: true },
  user: { type: String, required: true },
});

export default mongoose.model("Track", Track);
