const express = require("express");
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get("/info", middlewares.verifyAccessToken, controllers.users.info);
router.post("/likes", middlewares.verifyAccessToken, controllers.users.likes);
router.get(
  "/likes",
  middlewares.verifyAccessToken,
  controllers.users.getLikesCloth
);

router.post("/asked", middlewares.verifyAccessToken, controllers.users.saveUserAsked)
module.exports = router;
