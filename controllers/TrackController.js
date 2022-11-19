import Track from "../Models/Track.js";
import Playlist from "../Models/Playlist.js";
import User from "../Models/User.js";
import TrackService from "../services/TrackService.js";
import Comment from "../Models/Comment.js";

class TrackController {
  async getOneComment(req, res) {
    try {
      const { id } = req.params;

      const comment = await Comment.findById(id);
      const user = await User.findById(comment.user);

      const noPhoto =
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png";

      const createdComment = comment.toObject();
      res.json({
        ...createdComment,
        user: {
          name: user.username,
          photo: user.photo ? user.photo : noPhoto,
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async createComment(req, res) {
    try {
      const user = req.user;
      const { id } = req.params;
      const { text } = req.query;

      const createdComment = await Comment.create({
        text,
        date: new Date(),
        user: user._id,
      });

      await Track.findByIdAndUpdate(id, {
        $push: { comments: createdComment._id },
      });

      return res.json(createdComment._id);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async create(req, res) {
    try {
      const { name, artist, length, cover, audio } = req.body;
      const track = await Track.create({
        name,
        artist,
        length,
        cover,
        audio,
      });
      res.json(track);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async getAll(req, res) {
    try {
      const page = req.query.page * 10 || 0;
      const { sortingType } = req.query;

      if (sortingType === "newest") {
        // const tracks = await Track.find({}, { _id: -1 }).skip(page).limit(10); // Return ids in obj
        const tracks = await Track.find()
          .sort({ $natural: -1 })
          .skip(page)
          .limit(10); // Return ids in obj

        const mapped = tracks.map((obj) => {
          return obj._id;
        });

        return res.json(mapped);
      }

      const tracks = await Track.find({}, { _id: 1 })
        .sort({ listens: -1 })
        .skip(page)
        .limit(10); // Return ids in obj

      const mapped = tracks.map((obj) => {
        return obj._id;
      });

      return res.json(mapped);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Id is not specified" });
      }
      const track = await Track.findByIdAndUpdate(
        id,
        {
          $inc: { listens: 1 },
        },
        {
          returnDocument: "after",
        }
      );
      return res.json(track.listens);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async updateFavorites(req, res) {
    try {
      const { _id } = req.user;
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Id is not specified" });
      }

      const track = await Track.findById(id);

      const isAlreadyIn = playlist.favorites.find((item) => item.equals(id));

      if (isAlreadyIn) {
        return res.status(400).json({ message: "Track is already in" });
      }

      User.findOneAndUpdate(
        { _id },
        { $push: { favorites: track } },
        function (error, success) {
          if (error) {
            res.status(500).json(error);
          } else {
            console.log(success);
          }
        }
      );

      return res.json("Track added to favorites succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Id not specified" });
      }
      const track = await Track.findById(id);
      return res.json(track);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async player(req, res) {
    try {
      const { id } = req.params;
      const { type, dir, filter, position } = req.query;

      if (dir === "playlists") {
        const playlist = await Playlist.findById(id);

        //Playlist ending
        if (
          (type === "next" &&
            playlist.tracks.length === Number(position) + 1) ||
          (type === "previous" && Number(position) === 0)
        ) {
          const trackId = playlist.tracks[0];
          const track = await Track.findById(trackId);
          return res.json({ ...track.toObject(), directory: dir, position: 0 });
        }

        if (type === "next") {
          const trackId = playlist.tracks[Number(position) + 1];
          const track = await Track.findById(trackId);
          return res.json({
            ...track.toObject(),
            directory: dir,
            position: Number(position) + 1,
          });
        }

        // Previous
        const trackId = playlist.tracks[Number(position) - 1];
        const track = await Track.findById(trackId);
        return res.json({
          ...track.toObject(),
          directory: dir,
          position: Number(position) - 1,
        });
      }

      // Home directory
      const tracksCount = await Track.count();

      //Previous ending
      if (type === "previous" && Number(position) === 0) {
        const track = await TrackService.listEnd(filter);
        return res.json({ ...track, directory: dir, position: 0, filter });
      }

      //Next ending
      if (Number(position) + 1 === tracksCount) {
        const track = await TrackService.listEnd(filter);
        return res.json({ ...track, directory: dir, position: 0, filter });
      }

      // Previous song endpoint
      if (type === "previous") {
        const track = await TrackService.previousSong(filter, position);

        return res.json({
          ...track,
          directory: dir,
          position: Number(position) - 1,
          filter,
        });
      }

      const track = await TrackService.nextSong(filter, position);

      return res.json({
        ...track,
        directory: dir,
        position: Number(position) + 1,
        filter,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new TrackController();
