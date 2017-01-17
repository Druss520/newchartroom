var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var config = require('config-lite');
var http = require('http');

var validusers = [
    {username:'lizhuo',password:'666666'},
    {username:'豪哥',password:'666666'}
];

module.exports.users= validusers;

var index = require('./routes/chatroom');
var signin = require('./routes/signin');
var signup = require('./routes/signup');

var app = express();


var clients = [];
var users = [];

var server = http.Server(app);

module.exports.server = server;

var io = require('socket.io')(server);

io.on('connection', function(socket){
    // console.log(socket.id);
    // var id = socket.id;
    //
    // users[id] = 'default name';
    //
    // io.to(id).emit('sid', id);

    socket.on('online',function (data) {
        var data = JSON.parse(data);
        // console.log(data.user);
        if(!clients[data.user]){
            users.unshift(data.user);
            for(var i in clients){
                clients[i].emit('systemmessage',JSON.stringify({time:(new Date().getTime()),type:'online',user:data.user}));
                clients[i].emit('showuser',JSON.stringify({users:users}));
            }
            socket.emit('systemmessage',JSON.stringify({type:'into',user:'',time:(new Date()).getTime()}));
        }
        clients[data.user] = socket;
        clients[data.user].emit('showuser',JSON.stringify({users:users}));
    });

    socket.on('say',function (data) {
        var data = JSON.parse(data);
        var Data = {
            time:(new Date()).getTime(),
            data:data
        };
        if(data.to == 'all'){
            for(var i in clients){
                clients[i].emit('talk',Data);
            }
        }
        else{
            clients[data.to].emit('talk',Data);
            clients[data.from].emit('talk',Data);
        }
    });

    socket.on('disconnect',function(){
        //有人下线
        setTimeout(userOffline,2000);
        function userOffline()
        {
            for(var index in clients)
            {
                if(clients[index] == socket)
                {
                    users.splice(users.indexOf(index),1);
                    delete clients[index];
                    for(var i in clients)
                    {
                        clients[i].emit('systemmessage',JSON.stringify({type:'offline',user:index,time:(new Date()).getTime()}));
                        clients[i].emit('showuser',JSON.stringify({users:users}));
                    }
                    break;
                }
            }
        }
    });
});

app.use(session({
    name:config.session.key,
    secret:config.session.secret,
    store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie:{
        maxAge:config.session.maxAge
    }
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(function(req, res, next){
    res.io = io;
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/',signin);
app.use('/',signup);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  try {
    return res.json(err.message || "500 error")
  }
  catch(e) {
    console.log(e);
  }
});



module.exports.app = app;
