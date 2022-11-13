import Track from "../Models/Track.js";
import User from "../Models/User.js";

class FavoriteController {
  async getAll(req, res) {
    try {
      const page = req.query.page * 10 || 0;
      const favorites = req.user.favorites.slice(page, page + 10);
      return res.json(favorites);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async check(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;
      const isAlreadyIn = user.favorites.find((item) => item.equals(id));

      if (isAlreadyIn) {
        return res.json(true);
      }
      return res.json(false);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async update(req, res) {
    try {
      const user = req.user;
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Id is not specified" });
      }

      const track = await Track.findById(id);

      const isAlreadyIn = user.favorites.find((item) => item.equals(id));

      if (isAlreadyIn) {
        await User.findByIdAndUpdate(user._id, {
          $pull: {
            favorites: track._id,
          },
        });
        return res.json({ message: "Track removed succesfully" });
      }

      User.findByIdAndUpdate(user._id, { $push: { favorites: track } });

      return res.json("Track added to favorites succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async player(req, res) {
    try {
      const { type, position } = req.query;

      const tracks = req.user.favorites;
      //Playlist ending
      if (
        (type === "next" && tracks.length === Number(position) + 1) ||
        (type === "previous" && Number(position) === 0)
      ) {
        const trackId = tracks[0];
        const track = await Track.findById(trackId);
        return res.json({ ...track.toObject(), position: 0 });
      }

      if (type === "next") {
        const trackId = tracks[Number(position) + 1];
        const track = await Track.findById(trackId);
        return res.json({
          ...track.toObject(),
          position: Number(position) + 1,
        });
      }

      // Previous
      const trackId = tracks[Number(position) - 1];
      const track = await Track.findById(trackId);
      return res.json({
        ...track.toObject(),
        position: Number(position) - 1,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new FavoriteController();
