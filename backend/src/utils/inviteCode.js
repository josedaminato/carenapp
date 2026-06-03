const { customAlphabet } = require('nanoid');
const config = require('../config');

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const generateCode = customAlphabet(alphabet, config.inviteCodeLength);

function generateInviteCode() {
  return generateCode();
}

module.exports = { generateInviteCode };
