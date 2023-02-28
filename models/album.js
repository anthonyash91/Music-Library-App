const { Schema, model } = require('mongoose');

const albumSchema = newSchema({
  data: {
    uri: { type: String, required: true },
    name: { type: String, required: true },
    artists: { items: { type: Array, required: true } },
    coverArt: { sources: { type: Array, required: true } },
    date: { year: { type: Number, required: true } }
  },
  spotifyId: { type: String, required: true },
  favorite: { type: Boolean, required: true }
});

const Album = model('Album', albumSchema);
module.exports = Album;
