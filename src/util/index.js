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
        res.json(result);
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
