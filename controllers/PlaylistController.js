import Playlist from "../Models/Playlist.js";
import User from "../Models/User.js";
import Track from "../Models/Track.js";

class PlaylistController {
  async create(req, res) {
    try {
      const { id } = req.user;
      const { cover, name } = req.body;

      const playlist = await Playlist.create({
        user: id,
        cover,
        name,
      });
      User.findOneAndUpdate(
        { _id: id },
        { $push: { playlists: playlist } },
        function (error, success) {
          if (error) {
            res.status(500).json(error);
          } else {
            console.log(success);
          }
        }
      );
      res.json(playlist);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async getAll(req, res) {
    try {
      const user = req.user;
      // const playlists = await Playlist.find();
      return res.json(user.playlists);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async getOriginalPlaylists(req, res) {
    try {
      const popular = await Track.find().sort({ listens: -1 }).limit(20);
      const random = await Track.aggregate([{ $sample: { size: 20 } }]);

      const mappedPopular = popular.map((item) => {
        return item._id;
      });
      const mappedRandom = random.map((item) => {
        return item._id;
      });

      const originalPlaylists = {
        recommended: "6351a9c84cc1edde353f0965",
        popular: "6351a97a4cc1edde353f093f",
        oldFavorites: "635074479efce5d121c5570a",
      };

      await Playlist.findByIdAndUpdate(
        originalPlaylists.recommended,
        { tracks: mappedRandom },
        { new: true }
      );
      await Playlist.findByIdAndUpdate(
        originalPlaylists.popular,
        { tracks: mappedPopular },
        { new: true }
      );

      return res.json([
        originalPlaylists.recommended,
        originalPlaylists.popular,
        originalPlaylists.oldFavorites,
      ]);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Id not specified" });
      }
      const playlist = await Playlist.findById(id);
      return res.json(playlist);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async update(req, res) {
    try {
      const { playlistId, trackId } = req.body;
      const playlist = await Playlist.findById(playlistId);
      const track = await Track.findById(trackId);

      if (!playlistId || !trackId) {
        return res.status(400).json({ message: "Id not specified" });
      }

      if (!playlist) {
        return res.status(400).json({ message: "Can not find playlist" });
      }
      if (!track) {
        return res.status(400).json({ message: "Can not find track" });
      }

      if (!req.user._id.equals(playlist.user)) {
        return res.status(403).json({ message: "You don't have permission" });
      }

      const isAlreadyIn = playlist.tracks.find((item) =>
        item._id.equals(trackId)
      );

      if (isAlreadyIn) {
        return res.status(400).json({ message: "Track is already in" });
      }

      Playlist.findOneAndUpdate(
        { _id: playlistId },
        { $push: { tracks: track._id } },
        function (error, success) {
          if (error) {
            res.status(500).json(error);
          } else {
            console.log(success);
          }
        }
      );

      return res.json("Tracks added succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async edit(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Id not specified" });
      }
      const { name, cover } = req.body;

      if (name) {
        await Playlist.findByIdAndUpdate(id, {
          $set: { name: name },
        });
      }
      if (cover) {
        await Playlist.findByIdAndUpdate(id, {
          $set: { cover: cover },
        });
      }

      return res.json("Saved succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Id not specified" });
      }
      const findPlaylist = await Playlist.findById(id);

      if (!findPlaylist.user.equals(req.user._id)) {
        return res.status(403).json({ message: "You don't have permission" });
      }
      const playlist = await Playlist.findByIdAndDelete(id);
      await User.findByIdAndUpdate(req.user._id, {
        $pull: {
          playlists: id,
        },
      });
      return res.json({ message: "Track removed succesfully" });
      return res.json("Playlist deleted succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new PlaylistController();
