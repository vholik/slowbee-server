import mongoose from "mongoose";
import { Schema } from "mongoose";
import { ObjectId } from "mongoose";

const User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String },
  playlists: [{ type: ObjectId, ref: "Playlist" }],
  favorites: [{ type: ObjectId, ref: "Track", unique: true }],
});

export default mongoose.model("User", User);
