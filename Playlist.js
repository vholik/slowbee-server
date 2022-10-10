import mongoose, { Schema } from "mongoose";

const Playlist = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: String, required: true },
  tracks: { type: Schema.Types.ObjectId, ref: "Track" },
  cover: { type: String },
});

export default mongoose.model("Playlist", Playlist);
