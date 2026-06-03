const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const groupController = require('../controllers/groupController');

const router = require('express').Router();

router.use(authenticate);

router.get('/', groupController.listGroups);

router.post(
  '/',
  [body('name').trim().isLength({ min: 2, max: 60 }), validate],
  groupController.createGroup
);

router.post(
  '/join',
  [body('inviteCode').trim().isLength({ min: 6, max: 12 }), validate],
  groupController.joinGroup
);

router.get('/:id', groupController.getGroup);

router.post('/:id/fire', groupController.triggerFire);

module.exports = router;
