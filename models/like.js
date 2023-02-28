const { Schema, model } = require('mongoose');

const likeSchema = new Schema({
  data: {
    albumName: { type: String, required: true },
    trackName: { type: String, required: false },
    albumUri: { type: String, required: true },
    artists: { items: { type: Array, required: true } },
    coverArt: { type: String, required: true },
    preview: { type: String, required: false },
    playlist: { type: String, require: false },
    duration: { type: String, required: false },
    playCount: { type: String, required: false }
  },
  spotifyId: { type: String, required: false }
});

const Like = model('Like', likeSchema);

module.exports = Like;
