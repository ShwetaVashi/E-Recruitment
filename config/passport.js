var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../models/user');
var HRDetails = require('../models/HRdetails');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    contactno: 'contactno',

    passReqToCallback: true
}, function (req, email, password, done) {
    process.nextTick(function () {
        User.findOne({'email': email}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false, {message: 'Email is already taken.'});
            }
            var newUser = new User();
            newUser.fname = req.body.fname;
            newUser.lname = req.body.lname;
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.gender = req.body.gender;
            newUser.contactno = req.body.contactno;
            newUser.imagefile = req.file.filename;
            newUser.education = req.body.education;
            newUser.workexperience = req.body.workexperience;
            newUser.areaofinterest = req.body.areaofinterest;
            newUser.skills = req.body.skills;
            newUser.toolsandtechnology = req.body.toolsandtechnology;
            newUser.usertype=req.body.usertype;
            
            if(newUser.usertype == "0"){
                newUser.status = "0";
            }
            else{
                newUser.status = "1";
            }

            newUser.save(function (err, result) {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    status: 'status',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({'email': email}, function (err, user) {
        console.log(user.status);
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    });
}));
