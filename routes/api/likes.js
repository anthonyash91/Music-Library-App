const express = require('express');
const router = express.Router();

const {
  likesDataController,
  likesApiController
} = require('../../controllers/api/likes');

router.get('/', likesDataController.index, likesApiController.index);

router.delete(
  '/:spotifyId/:userId',
  likesDataController.destroy,
  likesApiController.show
);

router.get('/:id', likesDataController.show, likesApiController.show);

router.post(
  '/user/:userId',
  likesDataController.create,
  likesApiController.show
);

module.exports = router;
