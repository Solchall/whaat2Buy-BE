const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const usersRouter = require("./users");
const itemsRouter = require("./items");

// handle all /auth prefix
router.use("/auth", authRouter);

// handle all /users prefix
router.use("/users", usersRouter);

// handle all /items prefix
router.use("/items", itemsRouter);

module.exports = router;
