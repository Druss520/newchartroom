/**
 * Created by yanglizhuo on 16/12/18.
 */

angular.module('webapp').controller("chatController",["$scope","socketFactory","signService",'$window',chatController]);


function chatController($scope,socketFactory,signService,$window) {
    // console.log(userinfofactory.getter());

    var to = 'all';
    var from = '';
    $scope.onlineUsers = [];
    // $scope.sysmessages = [];
    $scope.textmsg = '';
    $scope.allmsg =[];
    // $scope.case1 = [];
    // $scope.case2 = [];
    // $scope.case3 = [];
    // $scope.case4 = [];
    $scope.music ='';

    $scope.loadChat = function () {
        signService.gochat().then(
            function (data) {
                // console.log(data);
                if(data.data=="hehe"){

                }
                else{
                    // console.log(data.data.username);
                    $scope.fromname = data.data.username;
                    from = $scope.fromname;
                    socketFactory.emit('online',JSON.stringify({user:from}));
                }
            },
            function (error) {
                console.log(error);
            }
        )

    };

    $scope.loadChat();

    socketFactory.on('showuser',function(data1){
        // console.log(data)
        var data = JSON.parse(data1);
        // alert(data.users)
        // console.log(data);
        var users = data.users;
        showUsers(users);
        speakto();
        $scope.$digest();
    });

    socketFactory.on('systemmessage',function (data1) {
        var data = JSON.parse(data1);
        var time = showTime(data.time);
        var msg = '';
        if(data.type=='online'){
            msg += "用户 "+data.user + " 上线了";
            // $scope.music = '/ring/595.wav';
        }
        else if(data.type=='offline'){
            msg +="用户 "+data.user + ' 下线了'
        }
        else if(data.type=='into'){
            msg +="你进入了聊天室"
        }

        var message = {
            type:1,
            say:'系统提示('+time+'):'+msg
        };

        $scope.allmsg.push(message);
        // var height = angular.element('#messages')[0].scrollHeight;
        // $window.scrollTo(0,height);
        $scope.$broadcast("autoscrolltop");
    });

    socketFactory.on('disconnect',function(){
        var message = {
            type:1,
            say:'系统提示: 服务器连接已断开'
        };

        $scope.allmsg.push(message);
        $scope.onlineUsers =[];
        $scope.$digest();
    });
    socketFactory.on('reconnect',function(){
        socketFactory.emit('online',JSON.stringify({user:from}));
        var message = {
            type:1,
            say:'系统提示: 已重新连接服务器'
        };

        $scope.allmsg.push(message);
        // var height = angular.element('#messages')[0].scrollHeight;
        // $window.scrollTo(0,height);
        $scope.$broadcast("autoscrolltop");

    });

    $scope.sendmsg = function (data,$event) {
        $event.preventDefault();
        if(data==''){
            return;
        }
        socketFactory.emit('say',JSON.stringify({to:to,from:$scope.fromname,msg:data}));
        $scope.textmsg ='';
        $scope.textfocus = true;
    };

    socketFactory.on('talk',function (msgdata) {
        var time = msgdata.time;
        time=showTime(time);
        var data = msgdata.data;
        // console.log(data);
        // alert(1)

        if(data.to == 'all'){
            if(data.from == from){
                var message = {
                    type:2,
                    say:data.from+' ('+time+'):',
                    msg:data.msg,
                    who:1
                };
                $scope.allmsg.push(message);
            }
            else{
                 message = {
                    type:3,
                    say:data.from+' ('+time+'):',
                    msg:data.msg,
                    who:2
                };
                $scope.allmsg.push(message);
            }
        }
        else if(data.to == from){
            message = {
                type:3,
                say:data.from+' ('+time+')悄悄对你说:',
                msg:data.msg,
                who:2
            };
            $scope.allmsg.push(message);
        }
        else if(data.from == from){
            message = {
                type:2,
                say:'你 ('+time+')悄悄对 '+data.to+' 说:',
                msg:data.msg,
                who:1
            };
            $scope.allmsg.push(message);
        }

        $scope.$digest();
        // var height = angular.element('#messages')[0].scrollHeight;
        // $window.scrollTo(0,height);
        $scope.$broadcast("autoscrolltop");
        // $scope.music = '/ring/4085.wav';

    });

    $scope.choosecls = function (data) {

    };

    function showUsers(users) {
        $scope.onlineUsers=users;
        $scope.onlineUsers.unshift('所有人');
    }

    $scope.dbclick = function (index) {
        console.log('hehe');
        if($scope.onlineUsers[index]!=$scope.fromname){
            $scope.toname = $scope.onlineUsers[index];
            to = $scope.toname;
        }
        $scope.textfocus = true;
    };

    function speakto() {
        $scope.toname = (to=='all')?"所有人":to;
    }

    function showTime(time) {
        var dt = new Date(time);
        time = dt.getFullYear() + '-'+(dt.getMonth()+1) + '-'+dt.getDate()+' '+dt.getHours()+':'
            +(dt.getMinutes()<10? ('0'+dt.getMinutes()):dt.getMinutes())+':'+ (dt.getSeconds()<10?('0'+dt.getSeconds()):dt.getSeconds());
        return time;
    }




}