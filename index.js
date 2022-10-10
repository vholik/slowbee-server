import express from "express";
import mongoose from "mongoose";
import TrackRouter from "./TrackRouter.js";
import PlaylistRouter from "./PlaylistRouter.js";
import AuthRouter from "./AuthRouter.js";

const port = 5000;
const DB_URL = `mongodb+srv://imzape:wwwwww@slowtape.fyebpcb.mongodb.net/?retryWrites=true&w=majority`;

const app = express();

app.use(express.json());
app.use("/tracks", TrackRouter);
app.use("/playlists", PlaylistRouter);
app.use("/auth", AuthRouter);

async function startApp() {
  try {
    await mongoose.connect(DB_URL);
    app.listen(port, () => {
      console.log("App is working");
    });
  } catch (error) {
    console.log(error);
  }
}

startApp();
