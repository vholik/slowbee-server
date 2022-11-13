import Track from "../Models/Track.js";

class SearchController {
  async search(req, res) {
    try {
      const { keywords } = req.params;

      const result = await Track.find({
        $text: { $search: keywords },
      }).limit(10);

      return res.json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new SearchController();
