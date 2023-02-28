const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const checkToken = (req, res) => {
  console.log('req.user', req.user);
  res.json(req.exp);
};

const dataController = {
  async create(req, res, next) {
    try {
      const user = await User.create(req.body);
      const token = createJWT(user);
      res.locals.data.user = user;
      res.locals.data.token = token;
      next();
    } catch (e) {
      res.status(400).json(e);
    }
  },
  async login(req, res, next) {
    try {
      const user = await User.findOne({ email: req.body.email })
        .populate({
          path: 'albums',
          populate: { path: 'items' }
        })
        .populate({
          path: 'likes',
          populate: { path: 'items' }
        });

      if (!user) throw new Error();
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) throw new Error();
      res.locals.data.user = user;
      res.locals.data.token = createJWT(user);
    } catch {
      res.status(400).json('Bad Credentials');
    }
  },
  index(req, res, next) {
    User.find({}, (err, foundUsers) => {
      if (err) {
        console.error(err);
      } else {
        res.locals.data.users = foundUsers;
        next();
      }
    })
      .populate('albums')
      .populate('likes');
  },
  show(req, res, next) {
    User.findById(req.params.id, (err, foundUser) => {
      if (err) {
        console.error(err);
      } else {
        res.locals.data.user = foundUser;
        next();
      }
    })
      .populate({
        path: 'albums',
        populate: { path: 'items' }
      })
      .populate({
        path: 'likes',
        populate: { path: 'items' }
      });
  },
  update(req, res, next) {
    User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
        } else {
          res.locals.data.user = updatedUser;
          next();
        }
      }
    );
  },
  destroy(req, res, next) {
    User.findByIdAndDelete(req.params.id, (err, deletedUser) => {
      if (err) {
        console.error(err);
        res.status(400).send(err);
      } else {
        res.locals.data.user = deletedUser;
        next();
      }
    });
  }
};

const apiController = {
  auth(req, res) {
    res.json(res.locals.data.token);
  },
  index(req, res) {
    res.json(res.locals.data.users);
  },
  show(req, res) {
    res.json(res.locals.data.user);
  }
};

module.exports = {
  checkToken,
  dataController,
  apiController
};

function createJWT(user) {
  return jwt.sign({ user }, process.env.SECRET, { expiresIn: '24h' });
}
