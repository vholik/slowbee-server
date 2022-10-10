import Track from "../Track.js";

class TrackController {
  async create(req, res) {
    try {
      const { name, artist, length, cover, audio } = req.body;
      const track = await Track.create({ name, artist, length, cover, audio });
      res.status(200).json(track);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async getAll(req, res) {
    try {
      const tracks = await Track.find();
      return res.json(tracks);
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
}

export default new TrackController();
