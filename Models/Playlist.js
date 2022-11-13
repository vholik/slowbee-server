import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongoose";

const Playlist = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: ObjectId, ref: "User" },
  tracks: { type: Array, ref: "Track" },
  cover: { type: String },
});

export default mongoose.model("Playlist", Playlist);
