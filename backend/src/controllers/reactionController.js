const reactionService = require('../services/reactionService');

async function addReaction(req, res, next) {
  try {
    const reactions = await reactionService.addReaction(
      req.params.eventId,
      req.userId,
      req.body.emoji
    );
    res.json({ reactions });
  } catch (err) {
    next(err);
  }
}

async function removeReaction(req, res, next) {
  try {
    const reactions = await reactionService.removeReaction(
      req.params.eventId,
      req.userId,
      req.body.emoji
    );
    res.json({ reactions });
  } catch (err) {
    next(err);
  }
}

module.exports = { addReaction, removeReaction };
