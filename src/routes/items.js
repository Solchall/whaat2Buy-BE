const express = require("express");
const controllers = require("../controllers");


const router = express.Router();

router.post("/filtering", controllers.items.filerItems)
router.post("/magazines", controllers.items.magazineItems);

module.exports = router;