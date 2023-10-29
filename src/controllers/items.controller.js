const {errorHandler, withTransaction} = require("../util");

const axios = require("axios");

// @desc get filter - List Items
// @route POST /api/users/me
const filerItems = errorHandler(
  withTransaction(async (req, res, session) => {
   
    const body = {apikey:req.body.apikey,
    userNeed:req.body.userNeed
    }
    const response = await axios.post(
      `${process.env.AI_API_URL}/items/filtering`,
      body
    );

    return response.data;
  })
);

const magazineItems = errorHandler(
  withTransaction(async (req, res, session) => {
    const body = { apikey: req.body.apikey, userNeed: req.body.userNeed };
    const response = await axios.post(
      `${process.env.AI_API_URL}/items/magazines`,
      body
    );

    return response.data;
  })
);

const detailItem = errorHandler(
  withTransaction(async (req, res, session) => {
    const body = { apikey: req.body.apikey, productUrl: req.body.productUrl };
    const response = await axios.post(
      `${process.env.AI_API_URL}/items/details`,
      body
    );

    return response.data;
  })
);
const detailSize = errorHandler(
  withTransaction(async (req, res, session) => {
    const body = { apikey: req.body.apikey, productUrl: req.body.productUrl };
    const response = await axios.post(
      `${process.env.AI_API_URL}/items/details/size`,
      body
    );

    return response.data;
  })
);
const detailReview = errorHandler(
  withTransaction(async (req, res, session) => {
    const body = { apikey: req.body.apikey, productUrl: req.body.productUrl };
    const response = await axios.post(
      `${process.env.AI_API_URL}/items/details/review`,
      body
    );

    return response.data;
  })
);
module.exports = {
  filerItems,
  magazineItems,
  detailItem,
  detailSize,
  detailReview,
};