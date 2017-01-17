/**
 * Created by yanglizhuo on 16/12/13.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var users = require('../app').users;
// console.log(users)

router.get('/signup',function (req,res,next) {
    if(req.session.user){
        res.redirect('/')
    }
    else {
        res.sendFile(path.join(__dirname,'../public/','signup.html'))
    }
});

router.post('/signup',function (req,res,next) {
    // console.log(req);
    var name = req.body.username;
    var password = req.body.password;
    // console.log(name, password, users);

    // console.log(name);
    // console.log(users);

    if(users.find(function (item) {
            return item.username===name;
        })){
        // console.log("fuck");
    return res.json({data:"hehe"});
    }
    else {
        // console.log('fuck2')
        var user = {
            username: name,
            passoword: password
        };
        users.unshift(user);
        req.session.user = user;
        return res.json(user);
    }

});



module.exports = router;