var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = req.session.user;
  // console.log('dhere');
  // console.log(user);
  if(!user){
    res.redirect('/signin');
    //res.sendFile(path.join(__dirname,'../public/','signin.html'))
  }
  else{
    res.sendFile(path.join(__dirname,'../public/','chatroom.html'));
  }
});

router.get('/user',function (req, res, next) {
    var user = req.session.user;
    if(!user){
        res.json({data:'hehe'})
    }else{
        res.json(user);
    }
});


module.exports = router;
