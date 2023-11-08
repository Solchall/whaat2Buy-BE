const express = require("express");
const controllers = require("../controllers");


const router = express.Router();

router.post("/filtering", controllers.items.filerItems)
router.post("/magazines", controllers.items.magazineItems);
router.post("/details", controllers.items.detailItem);
router.post("/review", controllers.items.detailReview);
router.post("/size", controllers.items.detailSize);
router.post("/ask", controllers.items.detailAsk);

module.exports = router;