const prisma = require('../config/database');
const config = require('../config');
const { generateInviteCode } = require('../utils/inviteCode');
const { sendPushToUsers } = require('./pushService');

async function ensureMembership(groupId, userId) {
  const member = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!member) {
    const err = new Error('No eres miembro de este grupo');
    err.status = 403;
    throw err;
  }
  return member;
}

function isFireActive(group) {
  return group.fireLitUntil != null && group.fireLitUntil > new Date();
}

async function createGroup(userId, name) {
  let inviteCode;
  let attempts = 0;
  do {
    inviteCode = generateInviteCode();
    attempts++;
  } while (attempts < 5 && (await prisma.group.findUnique({ where: { inviteCode } })));

  const group = await prisma.group.create({
    data: {
      name,
      inviteCode,
      createdBy: userId,
      members: { create: { userId } },
    },
  });

  return formatGroup(group);
}

async function joinGroup(userId, inviteCode) {
  const group = await prisma.group.findFirst({
    where: { inviteCode: inviteCode.toUpperCase(), isActive: true },
    include: { _count: { select: { members: true } } },
  });

  if (!group) {
    const err = new Error('Código de invitación inválido');
    err.status = 404;
    throw err;
  }

  if (group._count.members >= config.maxGroupMembers) {
    const err = new Error('El grupo está lleno');
    err.status = 400;
    throw err;
  }

  const existing = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: group.id, userId } },
  });
  if (existing) {
    return formatGroup(group);
  }

  await prisma.groupMember.create({ data: { groupId: group.id, userId } });
  const updated = await prisma.group.findUnique({ where: { id: group.id } });
  return formatGroup(updated);
}

async function listUserGroups(userId) {
  const memberships = await prisma.groupMember.findMany({
    where: { userId, group: { isActive: true } },
    include: { group: true },
    orderBy: { joinedAt: 'desc' },
  });

  return memberships.map((m) => formatGroup(m.group));
}

async function getGroupDetail(groupId, userId) {
  await ensureMembership(groupId, userId);

  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group?.isActive) {
    const err = new Error('Grupo no encontrado');
    err.status = 404;
    throw err;
  }

  return formatGroup(group);
}

async function triggerFire(groupId, userId) {
  await ensureMembership(groupId, userId);

  const oneHourAgo = new Date(Date.now() - 3600000);
  const recentCount = await prisma.fireEvent.count({
    where: { userId, triggeredAt: { gte: oneHourAgo } },
  });

  if (recentCount >= config.maxFiresPerHour) {
    const err = new Error('Esperá un poquito antes de volver a encender el fuego');
    err.status = 429;
    throw err;
  }

  const fireLitUntil = new Date(Date.now() + config.fireDurationMinutes * 60 * 1000);

  const [, group] = await prisma.$transaction([
    prisma.fireEvent.create({ data: { groupId, userId } }),
    prisma.group.update({
      where: { id: groupId },
      data: { fireLitUntil },
    }),
  ]);

  const members = await prisma.groupMember.findMany({
    where: { groupId, userId: { not: userId } },
    select: { userId: true },
  });

  await sendPushToUsers(
    members.map((m) => m.userId),
    {
      title: '🔥',
      body: 'Alguien encendió el fuego.',
      data: { groupId, type: 'fire_triggered' },
    }
  );

  return formatGroup(group);
}

function formatGroup(group) {
  return {
    id: group.id,
    name: group.name,
    inviteCode: group.inviteCode,
    fireActive: isFireActive(group),
  };
}

module.exports = {
  createGroup,
  joinGroup,
  listUserGroups,
  getGroupDetail,
  triggerFire,
  ensureMembership,
};
