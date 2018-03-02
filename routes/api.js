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
 **/

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

// - - - - - - - - - - - - - - - -
//     GET ALL USERS
// - - - - - - - - - - - - - - - -
router.get('/user', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        user.find(function (err,comment) {
            if (err) return next(err);
            res.json(comment);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized. To get Users'});
    }
});

// - - - - - - - - - - - - - - - -
//     GET SINGLE USER BY ID - no security on this required
// - - - - - - - - - - - - - - - -

router.get('/user:id', function(req, res, next) {

    user.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });

});

// - - - - - - - - - - - - - - - -
//     UPDATE SINGLE USER BY ID
// - - - - - - - - - - - - - - - -

router.put('/user:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        user.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized to edit user.'});
    }
});

// - - - - - - - - - - - - - - - -
//     DELETE USER
// - - - - - - - - - - - - - - - -

router.delete('/user:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        user.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized to delete.'});
    }
});

/**
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  FILM REVIEW FUNCTIONS
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 **/

// - - - - - - - - - - - - - - - -
//     CREATE NEW REVIEW
// - - - - - - - - - - - - - - - -
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

// - - - - - - - - - - - - - - - -
//     GET ALL REVIEWS
// - - - - - - - - - - - - - - - -
router.get('/film', function(req, res) {
        Film.find(function (err,films) {
            if (err) return next(err);
            res.json(films);
        });
});

// - - - - - - - - - - - - - - - -
//     GET SINGLE REVIEW BY ID
// - - - - - - - - - - - - - - - -
router.get('/film:id', function(req, res, next) {

        Film.findById(req.params.id, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });

});

// - - - - - - - - - - - - - - - -
//     UPDATE REVIEW BY ID
// - - - - - - - - - - - - - - - -
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


// - - - - - - - - - - - - - - - -
//     DELETE REVIEW
// - - - - - - - - - - - - - - - -
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



/**
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  ANNOUNCEMENTS FUNCTIONS
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 **/
// - - - - - - - - - - - - - - - -
//     CREATE NEW ANNOUNCEMENT
// - - - - - - - - - - - - - - - -
router.post('/announcements', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        console.log(req.body);
        var newAnnouncements = new Announcement({

            title: req.body.title,
            author: req.body.author,
            message: req.body.message
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

// - - - - - - - - - - - - - - - -
//     GET ALL ANNOUNCEMENTS
// - - - - - - - - - - - - - - - -

router.get('/announcements', function(req, res) {

        Announcement.find(function (err,announments) {
            if (err) return next(err);
            res.json(announments);
        });

});

// - - - - - - - - - - - - - - - -
//     GET SINGLE ANNOUNCEMENTS BY ID
// - - - - - - - - - - - - - - - -
router.get('/announcements:id', function(req, res, next) {

    Announcement.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });

});

// - - - - - - - - - - - - - - - -
//     UPDATE ANNOUNCEMENTS BY ID
// - - - - - - - - - - - - - - - -
router.put('/announcements:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        Announcement.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized to update announcement.'});
    }
});


// - - - - - - - - - - - - - - - -
//     DELETE ANNOUNCEMENTS
// - - - - - - - - - - - - - - - -
router.delete('/announcements:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        Announcement.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized to delete announcement.'});
    }
});


/**
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  COMMENT FUNCTIONS
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 **/


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//    CREATE COMMENT
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.post('/comment', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        console.log(req.body);
        var newComment = new Comment({
            postID: req.body.postID,
            author: req.body.author,
            message: req.body.message
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
//    GET specific Comments based on postID
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


router.get('/comment:postID', function(req, res, next) {

    Comment.find({ postID: req.params.postID }, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });

});

// - - - - - - - - - - - - - - - -
//     UPDATE COMMENT BY ID
// - - - - - - - - - - - - - - - -
router.put('/comment:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        Comment.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized to update announcement.'});
    }
});


// - - - - - - - - - - - - - - - -
//     DELETE COMMENT
// - - - - - - - - - - - - - - - -
router.delete('/comment:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        Announcement.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized to delete announcement.'});
    }
});


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