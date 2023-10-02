const { errorHandler, withTransaction } = require("../util");
const models = require("../models");
const { HttpError } = require("../error");

// @desc get user's information
// @route POST /api/users/me
// @header {Bearer Token}
// @access Private
const info = errorHandler(withTransaction(async (req, res,session) => {
  const userDoc= await models.User.findById(req.userId).exec();
  const userData = userDoc["_doc"]
  if (!userDoc) {
    throw new HttpError(400, "User not found");
  }
  return {
    username: userData.username,
    email: userData.email,
  };
}));

// @desc post user's farivate clothId
// @route POST /api/users/likes
// @header {Bearer Token}
// @access Private

const likes =  errorHandler(withTransaction(async (req, res, session) => {
  

    const response = await models.Likes.findOneAndUpdate(
      {
        owner: req.userId,
      },
      {
        $addToSet: {
          clothId: { $each: [req.body.clothId] },
        },
      },
      { new: true, upsert: true }
    );
    console.log("auth Controller: likes", response);

    //await likesDoc.save({ session });
  return  { success: true };
}));


// @desc get All user's farivate clothId
// @route get /api/users/likes
// @header {Bearer Token}
// @access Private

const getLikesCloth = errorHandler(
  withTransaction(async (req, res, session) => {
    const clothDoc = await models.Likes.findOne( { "owner": req.userId },{"clothId":1,"_id":0} )
    // console.log(clothDoc["_doc"])
    const data = clothDoc["_doc"]
    if (!clothDoc) {
      throw new HttpError(400, "User not found");
    }
    return data
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
  info,
  likes,
  getLikesCloth,
  saveUserMessage,
};
