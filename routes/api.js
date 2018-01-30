var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Users = require('../models/user');

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


module.exports= router;