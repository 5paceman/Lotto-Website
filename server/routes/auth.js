const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Token = require("../model/token");


/* Checks the users credentials and returns a login token
 * Returns: JSON object with user token
 * Example Result: {'token':''}
 */
router.post("/login", async function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let user = await User.findOne({username: username});
    if(user)
    {
        user.comparePassword(password, function(err, isMatch) {
            if(err)
            {
                console.log(err);
                res.status(500).json({error: 'Password incorrect.'});
            } else {
                if(isMatch) {
                    let token = new Token({user: user._id});
                    token.save();
                    res.status(200).json({auth_token:token.token});
                } else {
                    res.status(400).json({error: 'Password incorrect.'});
                }
            }
        });
    } else {
        res.status(400).json({error: 'Invalid username'});
    }

});

module.exports = router;