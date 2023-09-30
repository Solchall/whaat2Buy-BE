const { errorHandler, withTransaction } = require("../util");
const models = require("../models");
const { HttpError } = require("../error");

// @desc get user's information
// @route POST /api/users/me
// @header {Bearer Token}
// @access Private
const me = errorHandler(withTransaction(async (req, res,session) => {
  const userDoc = await models.User.findById(req.userId).exec();
  if (!userDoc) {
    throw new HttpError(400, "User not found");
  }
  return userDoc;
}));

// @desc post user's farivate cloth Number
// @route POST /api/users/likes
// @header {Bearer Token}
// @access Private

const likes =  errorHandler(withTransaction(async (req, res, session) => {
  console.log("auth Controller: likes", req.body);

    const likesDoc = models.Likes({
      owner: req.userId,
      clothId: req.body.clothId,
    });

    await likesDoc.save({ session });
  return  { success: true };
}));;

module.exports = {
  me,
  likes,
};
