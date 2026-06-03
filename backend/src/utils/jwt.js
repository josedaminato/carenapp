const jwt = require('jsonwebtoken');
const config = require('../config');

function signAccessToken(userId) {
  return jwt.sign({ sub: userId, type: 'access' }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

function signRefreshToken(userId) {
  return jwt.sign({ sub: userId, type: 'refresh' }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwt.refreshSecret);
}

function getRefreshExpiryDate() {
  const days = parseInt(config.jwt.refreshExpiresIn, 10) || 7;
  const ms = days * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshExpiryDate,
};
