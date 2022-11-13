import Track from "../Models/Track.js";

class TrackService {
  async nextSong(filter, position) {
    if (filter === "popular") {
      const tracks = await Track.find()
        .sort({ listens: -1 })
        .skip(Number(position) + 1)
        .limit(1);

      const track = tracks[0].toObject();

      return track;
    }

    const tracks = await Track.find()
      .sort({ $natural: -1 })
      .skip(Number(position) + 1)
      .limit(1);

    const track = tracks[0].toObject();

    return track;
  }

  async previousSong(filter, position) {
    if (filter === "popular") {
      const tracks = await Track.find()
        .sort({ listens: -1 })
        .skip(Number(position) - 1)
        .limit(1);

      const track = tracks[0].toObject();

      return track;
    }

    const tracks = await Track.find()
      .sort({ $natural: -1 })
      .skip(Number(position) - 1)
      .limit(1);

    const track = tracks[0].toObject();

    return track;
  }

  async listEnd(filter) {
    if (filter === "popular") {
      const tracks = await Track.find().sort({ listens: -1 }).limit(1);

      const track = tracks[0].toObject();

      return track;
    }
    // Rest
    const tracks = await Track.find().sort({ $natural: -1 }).limit(1);

    const track = tracks[0].toObject();

    return track;
  }
}

export default new TrackService();
