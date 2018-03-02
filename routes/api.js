var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var user = require('../models/user');
var Film = require("../models/film");
var Announcement = require('../models/announcements');
var Comment = require('../models/comments')

var debug = require('debug')('myapi:server');


/**
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  USER FUNCTIONS
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * **/

// - - - - - - - - - - - - - - - -
//     CREATE NEW USER
// - - - - - - - - - - - - - - - -
router.post('/signup', function (req,res) {
    if(!req.body.email|| !req.body.password){
        res.json({
            success:false,
            msg: 'Please pass email and password'
        });
    }
    else{
        var newUser = new user({
            email:req.body.email,
            password:req.body.password
        });
        newUser.save(function (err) {
            if(err){
                console.log(err);
                return res.json({
                    success:false,
                    msg:'email already used'
                });
            }

            res.json({
                success:true,
                msg:'Successfully created new user'
            })
        })
    }
});

// - - - - - - - - - - - - - - - -
//     UPDATE USER
// - - - - - - - - - - - - - - - -
/* findByIdAndUpdate*/
router.put('/user:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        Film.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});
// - - - - - - - - - - - - - - - -
//     USER LOGIN
// - - - - - - - - - - - - - - - -

router.post('/signin', function (req,res) {
    user.findOne({
        email:req.body.email
    }, function (err, user) {
        if(err){
            debug(err);
            throw (err);
        }
        if(!user){

            res.status(401).send({
                success:false,
                msg:'Authentication failed'
            })
        } else{
            //  check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if(isMatch && !err){
                    var token = jwt.sign(user.toJSON(), config.secret);
                    res.json({
                        success: true,
                        token: 'JWT ' + token
                    });
                } else {
                    debug(err);
                    res.status(401).send({


                        success: false,
                        msg: 'this no  work'
                    })
                }
            })
        }
    })
});






// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//     FILMS REST API
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// POST FILm
router.post('/film', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        console.log(req.body);
        var newFilm = new Film({

            title: req.body.title,
            director: req.body.director,
            studio: req.body.studio,
            year: req.body.year,
            review: req.body.review,
            reviewer:req.body.reviewer,
            img: req.body.img

        });

        newFilm.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Save film failed.'});
            }
            res.json({success: true, msg: 'Successful created new film.'});
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

// router.get('/film', passport.authenticate('jwt', { session: false}), function(req, res) {
router.get('/film', function(req, res) {
    // var token = getToken(req.headers);
    // if (token) {
        Film.find(function (err,films) {
            if (err) return next(err);
            res.json(films);
        });
    // } else {
    //     return res.status(403).send({success: false, msg: 'Unauthorized.'});
    // }
});

/* GET SINGLE Film BY ID */
router.get('/film:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        Film.findById(req.params.id, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

/* findByIdAndUpdate*/
router.put('/film:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        Film.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});


/* DELETE Film */
router.delete('/film:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        Film.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//     ANNOUNCEMENTS
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.post('/announcements', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        console.log(req.body);
        var newAnnouncements = new Announcement({

            title: req.body.title,
            author: req.body.author,
            message: req.body.message,
        });

        newAnnouncements.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Save Announcement failed.'});
            }
            res.json({success: true, msg: 'Successful created new Announcement.'});
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized. To post Announcement'});
    }
});

router.get('/announcements', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        Announcement.find(function (err,announments) {
            if (err) return next(err);
            res.json(announments);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized. To get Announcements'});
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//    POST Comments
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.post('/comment', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        console.log(req.body);
        var newComment = new Comment({
            postID: req.body.postID,
            author: req.body.author,
            message: req.body.message,
        });

        newComment.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Save Comment failed.'});
            }
            res.json({success: true, msg: 'Successful created new Comment.'});
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized. To post Comment'});
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//    GET all Comments
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get('/comment', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        Comment.find(function (err,comment) {
            if (err) return next(err);
            res.json(comment);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized. To get Comments'});
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//    GET specific Comments based on postID
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//     Token
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};


module.exports= router;