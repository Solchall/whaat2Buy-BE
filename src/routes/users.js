const express = require("express");
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get("/me", middlewares.verifyAccessToken, controllers.users.me);
router.post("/likes", middlewares.verifyAccessToken, controllers.users.likes);

module.exports = router;
