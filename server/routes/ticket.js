var express = require("express");
var router = express.Router();
var Token = require("../model/token");
var User = require("../model/user");

router.post("/create", function(req, res, next) {
    res.status(501).json({error: 'Not implemented'});
});

router.post("/delete", function(req, res, next) {
    res.status(501).json({error: 'Not implemented'});
});

router.get("/get", function(req, res, next) {
    res.status(501).json({error: 'Not implemented'});
});

router.get("/check", function(req, res, next) {
    res.status(501).json({error: 'Not implemented'});
});

module.exports = router;