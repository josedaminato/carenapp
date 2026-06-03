const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = require('express').Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('displayName').trim().isLength({ min: 2, max: 50 }),
    validate,
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate,
  ],
  authController.login
);

router.post('/refresh', [body('refreshToken').notEmpty(), validate], authController.refresh);

router.post('/logout', authController.logout);

router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail(), validate],
  authController.forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('newPassword').isLength({ min: 8 }),
    validate,
  ],
  authController.resetPassword
);

router.get('/me', authenticate, authController.me);

module.exports = router;
