var express = require("express");
var router = express.Router();


/* Checks the users credentials and returns a login token
 * Returns: JSON object with user token
 * Example Result: {'token':''}
 */
router.post("/login", function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;


});

module.exports = router;