const { Schema, model } = require('mongoose');

const albumSchema = new Schema({
  data: {
    uri: { type: String, required: true },
    name: { type: String, required: true },
    artists: { items: { type: Array, required: false } },
    coverArt: { sources: { type: Array, required: true } },
    date: { year: { type: Number, required: false } }
  },
  spotifyId: { type: String, required: false },
  favorite: { type: Boolean, required: false }
});

const Album = model('Album', albumSchema);

module.exports = Album;
