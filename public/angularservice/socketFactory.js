/**
 * Created by yanglizhuo on 16/12/17.
 */

angular.module('webapp').factory('socketFactory',function () {
    var socket = io();
    return{
        on: function (target,func) {
            socket.on(target,func);
        },
        emit:function (target,data) {
            socket.emit(target,data);
        }
    }
});