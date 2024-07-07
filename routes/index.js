var express = require("express");
const URL = require("../models/urls");
const {
    HandleGetURL,
    HandleGetAnalyticsID,
    HandleGenerateNewShortURL,
    HandlePostAnalytics,
} = require("../controllers/url");

var router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
    res.render("index");
});
router.get("/:id", HandleGetURL);

router.post("/url", HandleGenerateNewShortURL);
router.get("/url/analytics/", (req, res, next) => {
    res.render("analytics");
});
router.post("/analytics/", HandlePostAnalytics);
module.exports = router;
