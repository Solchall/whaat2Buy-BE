const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const usersRouter = require("./users");

// handle all /auth prefix
router.use("/auth", authRouter);

// handle all /users prefix
router.use("/users", usersRouter);

module.exports = router;
