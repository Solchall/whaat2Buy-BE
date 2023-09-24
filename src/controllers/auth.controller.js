const jwt = require("jsonwebtoken");
const models = require("../models");
const argon2 = require("argon2");
const {errorHandler, withTransaction} = require("../util");
const { HttpError } = require("../error");

// @desc SignUp
// @route POST /api/auth/signup
// @body {username, email, password}
// @access Public
const signup = errorHandler(
  withTransaction(async (req, res,session) => {
    console.log("auth Controller: signUp", req.body);
    const userDoc = models.User({
      username: req.body.username,
      email: req.body.email,
      password: await argon2.hash(req.body.password),
    });
    const refreshTokenDoc = models.RefreshToken({
      owner: userDoc.id,
    });
    await userDoc.save({session});
    await refreshTokenDoc.save({session});

    const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id);
    const accessToken = createAccessToken(userDoc.id);

    return {
      id: userDoc.id,
      accessToken,
      refreshToken,
    };
  })
);


// @desc Login
// @route POST /api/auth/login
// @body { email, password}
// @access Public
const login=errorHandler(withTransaction(
  async(req,res,session)=>{

    // get User
    // retrieve password by Entered Email
    const userDoc = await models.User.findOne({
      email:req.body.email
    }).select("+password").exec();

    // user do not exist
    if(!userDoc){
      throw new HttpError(401, "Wrong email or password");
    }

    // verify Password
    await verifyPassword(userDoc.password, req.body.password);

    // Create Tokens and Return to Client
    const refreshTokenDoc = models.RefreshToken({
      owner: userDoc.id,
    });

    await refreshTokenDoc.save({ session });

    const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id);
    const accessToken = createAccessToken(userDoc.id);

    return {
      id: userDoc.id,
      accessToken,
      refreshToken,
    };
  }
))

// @desc get RefreshToken
// @route POST api/auth/refreshToken
// @body {refreshToken}
// @access Public
const newRefreshToken=errorHandler(withTransaction(
async(req,res,session)=>{
  const currentRefreshToken = await validateRefreshToken(req.body.refreshToken);
    const refreshTokenDoc = models.RefreshToken({
      owner: currentRefreshToken.userId,
    });

    await refreshTokenDoc.save({ session });
    await models.RefreshToken.deleteOne(
      { _id: currentRefreshToken.tokenId },
      { session }
    );

    const refreshToken = createRefreshToken(
      currentRefreshToken.userId,
      refreshTokenDoc.id
    );
    const accessToken = createAccessToken(currentRefreshToken.userId);

    return {
      id: currentRefreshToken.userId,
      accessToken,
      refreshToken,
    };

}
))

// @desc get AccessToken
// @route POST api/auth/accessToken
// @body {refreshToken}
// @access Public
const newAccessToken = errorHandler(async (req, res) => {
  const refreshToken = await validateRefreshToken(req.body.refreshToken);
  const accessToken = createAccessToken(refreshToken.userId);

  return {
    id: refreshToken.userId,
    accessToken,
    refreshToken: req.body.refreshToken,
  };
});


// @desc delete One RefreshToken related to user
// @route POST api/auth/logout
// @body {refreshToken}
// @access Public
const logout = errorHandler(
  withTransaction(async (req, res, session) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    await models.RefreshToken.deleteOne(
      { _id: refreshToken.tokenId },
      { session }
    );
    return { success: true };
  })
);

// @desc delete All RefreshToken related to user
// @route POST api/auth/logoutAll
// @body {refreshToken}
// @access Public
const logoutAll = errorHandler(
  withTransaction(async (req, res, session) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    await models.RefreshToken.deleteMany(
      { owner: refreshToken.userId },
      { session }
    );
    return { success: true };
  })
);


function createAccessToken(userId) {
  return jwt.sign(
    {
      userId: userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10m",
    }
  );
}

function createRefreshToken(userId, refreshTokenId) {
  return jwt.sign(
    {
      userId: userId,
      tokenId: refreshTokenId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
}

// Compare password: encode(Entered Password) vs DB Password(already Encoded)
const verifyPassword = async (hashedPassword, rawPassword) => {
  if (await argon2.verify(hashedPassword, rawPassword)) {
    // password matches
  } else {
    // Password miss match => http Error
    throw new HttpError(401, "Wrong username or password");
  }
};

const validateRefreshToken = async (token) => {
  const decodeToken = () => {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      // err
      throw new HttpError(401, "Unauthorized");
    }
  };

  const decodedToken = decodeToken();
  const tokenExists = await models.RefreshToken.exists({
    _id: decodedToken.tokenId,
    owner: decodedToken.userId,
  });
  if (tokenExists) {
    return decodedToken;
  } else {
    throw new HttpError(401, "Unauthorized");
  }
};



module.exports = {
  signup,
  login,
  newRefreshToken,
  newAccessToken,
  logout,
  logoutAll,
};
