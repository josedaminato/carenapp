const LIGHT_MESSAGES = [
  'Alguien tuvo un momento especial ✨',
  'La luz volvió a encenderse 🔥',
  'Una chispa iluminó el grupo 💫',
  'La magia está en el aire 🌙',
  'Alguien brilló esta noche ✨',
  'El grupo se iluminó de nuevo 🔥',
  'Un momento íntimo compartido en secreto 💜',
  'La luz secretamente se encendió 🌟',
];

const ALLOWED_EMOJIS = ['✨', '🔥', '💜', '😍', '👏', '💫', '🌙', '❤️‍🔥'];

function randomLightMessage() {
  return LIGHT_MESSAGES[Math.floor(Math.random() * LIGHT_MESSAGES.length)];
}

module.exports = { LIGHT_MESSAGES, ALLOWED_EMOJIS, randomLightMessage };
