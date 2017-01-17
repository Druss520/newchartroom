/**
 * Created by yanglizhuo on 16/12/13.
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var users = require('../app').users;

router.get('/signin',function (req,res,next) {
    if(req.session.user){
        res.redirect('/');
    }
    else{
        res.sendFile(path.join(__dirname,'../public/','signin.html'))
    }

});

router.post('/signin',function (req,res,next) {
    var name= req.body.username;
    var password = req.body.password;
    // console.log(name, password);

    user = users.find(function (item) {
        return name === item.username && password === item.password
    });

    if(user){
        // res.cookie('user',user.username);
        // res.io.emit('hehe',user.username.toString());
        req.session.user = user;
        res.json(user.username);
    }
    else {
        return res.json({data:"hehe"});
        // res.send('<h1>用户名或密码错误</h1>');
    }

});


module.exports = router;