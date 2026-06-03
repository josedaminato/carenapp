const groupService = require('../services/groupService');

async function createGroup(req, res, next) {
  try {
    const group = await groupService.createGroup(req.userId, req.body.name);
    res.status(201).json({ group });
  } catch (err) {
    next(err);
  }
}

async function joinGroup(req, res, next) {
  try {
    const group = await groupService.joinGroup(req.userId, req.body.inviteCode);
    res.json({ group });
  } catch (err) {
    next(err);
  }
}

async function listGroups(req, res, next) {
  try {
    const groups = await groupService.listUserGroups(req.userId);
    res.json({ groups });
  } catch (err) {
    next(err);
  }
}

async function getGroup(req, res, next) {
  try {
    const group = await groupService.getGroupDetail(req.params.id, req.userId);
    res.json({ group });
  } catch (err) {
    next(err);
  }
}

async function triggerFire(req, res, next) {
  try {
    const group = await groupService.triggerFire(req.params.id, req.userId);
    res.status(201).json({ group });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createGroup,
  joinGroup,
  listGroups,
  getGroup,
  triggerFire,
};
