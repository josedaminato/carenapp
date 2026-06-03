const { registerPushToken, unregisterPushToken } = require('../services/pushService');

async function register(req, res, next) {
  try {
    const { token, platform } = req.body;
    await registerPushToken(req.userId, token, platform);
    res.json({ message: 'Token registrado' });
  } catch (err) {
    next(err);
  }
}

async function unregister(req, res, next) {
  try {
    const { token } = req.body;
    await unregisterPushToken(req.userId, token);
    res.json({ message: 'Token eliminado' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, unregister };
