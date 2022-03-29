var express = require("express");
var User = require("../model/user");
var Token = require("../model/token");
var router = express.Router();

/* Password Requirements */
const MIN_CHARACTERS = 8;
const MIN_SPECIAL = 0;
const MIN_UPPER = 0;


const emailRE = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

/*
 * Creates a user. 
 * Params: Username, Password, Email
 * If sucessful returns login token if not will return an error
 */
router.post("/create", async function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    if(email.toLowerCase().match(emailRE))
    {
        if(validatePassword(password))
        {
            var user = await User.findOne({username: username});
            if(user) {
                res.status(400).json({error: 'Username already exists'});
            } else {
                var newUser = new User({
                    username: username,
                    password: password,
                    email: email
                });

                var createdUser = await newUser.save();

                if(!createdUser) {
                    console.log(err);
                    res.status(400).json({error:'Unable to create new user, please try again shortly'});
                } else {
                    var newToken = new Token({user: createdUser._id});
                    newToken.save(function(err) {
                        if(err)
                            res.status(400).json({error: 'Unable to create auth token'});
                    });
                    
                    res.status(200).json({auth_token: newToken.token});
                }
            }
        } else {
            res.status(400).json({error: 'Password does not meet complexity requirements.'});
        }
    } else {
        res.status(400).json({error:'Email is not valid.'});
    }

});

/*
 * Updates a user objct
 * Params: auth_token
 * Optional: password, email
 * Will update the user object for the current user with either a new password, email or both
 */
router.post("/update", async function(req, res, next) {
    var password = req.body.password;
    var email = req.body.email;

    var token = await Token.findOne({token: req.body.auth_token}).populate('user');
    if(token)
    {
        var username = token.user.username;
        var updateObjects = {};
        if(password) {
            if(validatePassword(password))
                updateObjects['password'] = password;
            else
                res.status(400).json({error: 'Password does not meet complexity requirements.'});
        }
        
        if(email)
        {
            if(email.toLowerCase().match(emailRE))
                updateObjects['email'] = email;
            else
                res.status(400).json({error:'Email is not valid.'});
        }
        await User.findOneAndUpdate({username: username}, updateObjects).then((doc) => { 
            if(doc)
            {
                res.status(200).json({success: 'User updated successfully.'});
            }
        }).catch(err => {
            res.status(400).json({error: 'Unable to update user, please try again shortly.'});
            console.log(err);
        });
    } else {
        res.status(400).json({error:'Invalid auth token.'});
    }
});

/* Deletes a user 
 * @params: auth_token
 * @returns: success or error message
 */
router.post("/delete", async function(req, res, next) {
    var token = await Token.findOne({token: req.body.auth_token}).populate('user');
    if(token)
    {
        var username = token.user.username;
        User.deleteOne({username: username}).then((data) => {
            if(data)
            {
                Token.deleteMany({user: token.user._id}).then((data) => {
                    res.status(200).json({success: 'User deleted successfully.'});
                }).catch((err) => {
                    res.status(400).json({error: 'Unable to delete user, please try again shortly.'});
                });

            }
        }).catch((err) => {
            res.status(400).json({error: 'Unable to delete user, please try again shortly.'});
        });
    }
});

/*
 * Gets a user object
 * Params: auth_token
 * Returns: JSON object with username, email, created date and if the user is an admin
 */
router.get("/get", async function(req, res, next) {
    var token = await Token.findOne({token: req.query.auth_token}).populate('user');
    if(token) {
        var user = token.user;
        var jsonUser = {
            username: user.username,
            email: user.email,
            created: user.created,
            isAdmin: user.isAdmin
        };
        res.status(200).json(jsonUser);
    } else {
        res.status(400).json({error:'Invalid auth token.'});
    }
    
});

/*
 * Validates a users password against complexity requirements
 * Params: password
 * Returns: true or false depending on if the password matches complexity requirements
 */
function validatePassword(password) {
    if(password.length >= MIN_CHARACTERS)
    {
        var upperCount = password.length - password.replace(/[A-Z]/g, '').length;
        if(upperCount >= MIN_UPPER)
        {
            var specialCount = password.length - password.replace(/[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]/g, '').length;
            if(specialCount >= MIN_SPECIAL)
            {
                return true;
            }
        }
    }
    return false;
}

module.exports = router;