const { errorHandler } = require("../util");
const models = require("../models");
const { HttpError } = require("../error");


// @desc get user's information
// @route POST /api/users/me
// @header {Bearer Token}
// @access Public
const me = errorHandler(async (req, res) => {
  const userDoc = await models.User.findById(req.userId).exec();
  if (!userDoc) {
    throw new HttpError(400, "User not found");
  }
  return userDoc;
});

module.exports = {
  me,
};
