const prisma = require('../config/database');
const { ALLOWED_EMOJIS } = require('../utils/messages');
const { ensureMembership } = require('./groupService');

async function addReaction(lightEventId, userId, emoji) {
  if (!ALLOWED_EMOJIS.includes(emoji)) {
    const err = new Error('Emoji no permitido');
    err.status = 400;
    throw err;
  }

  const event = await prisma.lightEvent.findUnique({
    where: { id: lightEventId },
    select: { groupId: true },
  });

  if (!event) {
    const err = new Error('Evento no encontrado');
    err.status = 404;
    throw err;
  }

  await ensureMembership(event.groupId, userId);

  await prisma.reaction.upsert({
    where: {
      lightEventId_userId_emoji: { lightEventId, userId, emoji },
    },
    create: { lightEventId, userId, emoji },
    update: {},
  });

  const reactions = await prisma.reaction.groupBy({
    by: ['emoji'],
    where: { lightEventId },
    _count: { emoji: true },
  });

  return reactions.map((r) => ({ emoji: r.emoji, count: r._count.emoji }));
}

async function removeReaction(lightEventId, userId, emoji) {
  await prisma.reaction.deleteMany({
    where: { lightEventId, userId, emoji },
  });

  const reactions = await prisma.reaction.groupBy({
    by: ['emoji'],
    where: { lightEventId },
    _count: { emoji: true },
  });

  return reactions.map((r) => ({ emoji: r.emoji, count: r._count.emoji }));
}

module.exports = { addReaction, removeReaction };
