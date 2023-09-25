const mongoose = require("mongoose");


// take function as arguments
// get return object of function(passed by arguments) send back to json as client
function errorHandler(fn) {
  return async function (req, res, next) {
    try {
      let nextCalled = false;
      const result = await fn(req, res, (params) => {
        nextCalled = true;
        next(params);
      });
      if (!res.headersSent && !nextCalled) {

        if (result.refreshToken){
          const {refreshToken, ...rest}=result;
          // console.log(refreshToken, rest);
          res
            .cookie("refreshToken", refreshToken, {
              httpOnly: false,
            })
            .status(200)
            .json({ ...rest, message: "ok" });
        }
        else{
          res.status(200).json({ ...result, message: "ok" });
        }

      }
    } catch (e) {
      next(e);
    }
  };
}

// RollBack MongoDB Errors 
function withTransaction(fn){
  return async function (req, res, next) {
    let result;
    await mongoose.connection.transaction(async (session) => {
      result = await fn(req, res, session);
      return result;
    });

    return result;
  };
}


module.exports = {
  errorHandler,
  withTransaction
};
