/**
 * Created by yanglizhuo on 16/12/17.
 */

angular.module('webapp').factory('userinfofactory',function () {
    var user = {};

    var setuser = function (username) {
        user = username;
    };
    var getuser = function () {
        return user;
    };

    return {
        getter:getuser,
        setter:setuser
    }
});