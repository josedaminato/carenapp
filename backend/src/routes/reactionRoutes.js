const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const reactionController = require('../controllers/reactionController');

const router = require('express').Router();

router.use(authenticate);

router.post(
  '/:eventId/reactions',
  [body('emoji').notEmpty(), validate],
  reactionController.addReaction
);

router.delete(
  '/:eventId/reactions',
  [body('emoji').notEmpty(), validate],
  reactionController.removeReaction
);

module.exports = router;
