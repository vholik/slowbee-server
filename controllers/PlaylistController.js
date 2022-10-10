import Playlist from "../Playlist.js";

class PlaylistController {
  async create(req, res) {
    try {
      const { user, cover, name } = req.body;
      if (!cover) {
        const playlist = await Playlist.create({
          user,
          name,
        });
        return res.json(playlist);
      }
      const playlist = await Playlist.create({
        user,
        cover,
        name,
      });
      res.json(playlist);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async getAll(req, res) {
    try {
      const playlists = await Playlist.find();
      return res.json(playlists);
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
      const playlist = await Playlist.findById(id);
      return res.json(playlist);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async update(req, res) {
    try {
      const playlist = req.body;
      if (req.user._id !== playlist.user) {
        return res.status(403).json({ message: "User is not authorized" });
      }
      if (!playlist._id) {
        res.status(400).json({ message: "Id not specified" });
      }
      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist._id,
        playlist,
        { new: true }
      );
      return res.json(updatedPost);
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
      if (findPlaylist.user !== req.user._id) {
        return res.status(403).json({ message: "User is not authorized" });
      }
      const playlist = await Playlist.findByIdAndDelete(id);
      return res.json(playlist);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new PlaylistController();
