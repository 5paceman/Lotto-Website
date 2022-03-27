var express = require("express");
var router = express.Router();
var User = require("../model/user");
var Token = require("../model/token");


/* Checks the users credentials and returns a login token
 * Returns: JSON object with user token
 * Example Result: {'token':''}
 */
router.post("/login", function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    var user = User.findOne({username: username});
    if(user)
    {
        user.comparePassword(password, function(err, isMatch) {
            if(err)
            {
                console.log(err);
            } else {
                if(isMatch) {
                    var token = new Token({user: user});
                    token.save();
                    res.json({auth_token:token.token});
                } else {
                    res.json({error: 'Password incorrect.'});
                }
            }
        });
    } else {
        res.json({error: 'Invalid username'});
    }

});

module.exports = router;