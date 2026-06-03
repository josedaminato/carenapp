const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const pushController = require('../controllers/pushController');

const router = require('express').Router();

router.use(authenticate);

router.post(
  '/register',
  [body('token').notEmpty(), validate],
  pushController.register
);

router.post(
  '/unregister',
  [body('token').notEmpty(), validate],
  pushController.unregister
);

module.exports = router;
