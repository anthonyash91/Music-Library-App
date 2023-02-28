const Like = require('../../models/like');
const User = require('../../models/user');

const likesDataController = {
  index(req, res, next) {
    Like.find({}, (err, foundLikes) => {
      if (err) {
        res.status(400).send({
          msg: err.message
        });
      } else {
        res.locals.data.likes = foundLikes;
        next();
      }
    });
  },
  async destroy(req, res, next) {
    try {
      const user = await User.findById(req.params.userId);

      const foundLike = await Like.findOne({
        spotifyId: req.params.spotifyId
      });

      if (foundLike._id) {
        const deletedLike = await Like.findByIdAndDelete(foundLike._id);
        res.locals.data.like = deletedLike;
        user.likes.items.remove(deletedLike._id);
        user.save();
        next();
      } else {
        res.status(400).send({
          msg: 'like ID not found'
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async create(req, res, next) {
    try {
      const user = await User.findById(req.params.userId);

      Like.create(req.body, (err, createdLike) => {
        if (err) {
          res.status(400).send({
            msg: err.message
          });
        } else {
          user.likes.items.addToSet(createdLike._id);
          user.save();
          res.locals.data.like = createdLike;
          res.locals.data.user = user;
          next();
        }
      });
    } catch {
      res.status(400).json('there was an error');
    }
  },
  show(req, res, next) {
    Like.findById(req.params.id, (err, foundLike) => {
      if (err) {
        res.status(404).send({
          msg: err.message,
          output: 'Could not find an like with that ID'
        });
      } else {
        res.locals.data.like = foundLike;
        next();
      }
    });
  }
};

const likesApiController = {
  index(req, res, next) {
    res.json(res.locals.data.likes);
  },
  show(req, res, next) {
    res.json(res.locals.data.like);
  }
};

module.exports = { likesDataController, likesApiController };
