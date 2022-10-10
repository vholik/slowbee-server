import mongoose from "mongoose";
import { Schema } from "mongoose";

const User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String },
  playlists: { type: Schema.Types.ObjectId, ref: "Playlist" },
  favorites: { type: Schema.Types.ObjectId, ref: "Tracks" },
});

export default mongoose.model("User", User);
