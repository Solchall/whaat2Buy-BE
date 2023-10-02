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

// @desc post user's farivate clothId
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
}));


// @desc get All user's farivate clothId
// @route get /api/users/likes
// @header {Bearer Token}
// @access Private

const getLikesCloth = errorHandler(
  withTransaction(async (req, res, session) => {
    const clothDoc = await models.Likes.find( { "owner": req.userId } )
    if (!clothDoc) {
      throw new HttpError(400, "User not found");
    }
    return clothDoc;
  })
);

// @desc save User Message
// @route get /api/users/message
// @header {Bearer Token}
// @access Private

const saveUserMessage = errorHandler(
  withTransaction(async (req, res, session) => {
    console.log("users Controller: userMessage", req.body);

    const userMessageDoc = models.userMessage({
      owner: req.userId,
      clothId: req.body.clothId,
      message: req.body.message
    });

    await userMessageDoc.save({ session });
    return { success: true };
  })
);

module.exports = {
  me,
  likes,
  getLikesCloth,
  saveUserMessage,
};
