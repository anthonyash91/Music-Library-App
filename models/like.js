const { Schema, model } = require('mongoose');

const likeSchema = new Schema({
  data: {
    albumName: { type: String, required: true },
    trackName: { type: String, required: true },
    albumUri: { type: String, required: true },
    artists: { items: { type: Array, required: true } },
    coverArt: { type: String, required: true },
    preview: { type: String, required: true },
    playlist: { type: String, required: true },
    duration: { type: String, required: true },
    playCount: { type: String, required: true }
  },
  spotifyId: { type: String, required: true }
});

const Like = model('Like', likeSchema);
module.exports = Like;
