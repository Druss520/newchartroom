/**
 * Created by yanglizhuo on 16/12/16.
 */

angular.module('webapp').service('signService',["$http",'$q',signService]);

function signService($http,$q) {
    
    function handleRequest(method,url, data) {
        var deferred = $q.defer();

        var config = {
            method:method,
            url:url
        };
        if(method=== "POST"){
            config.data = data
        }else if(method=== "GET"){
            config.params = data
        }

        $http(config).then(
            function (data) {
            // console.log(data);
            deferred.resolve(data);
            },
            function (e) {
            // console.log('fail:' + data);
            deferred.reject(e);
            }
        );

        return deferred.promise;

    }



    return{
        signup:function (data) {
            return handleRequest('POST','/signup',data)
        },
        signin:function (data) {
            return handleRequest('POST','/signin',data)
        },
        gochat:function (data) {
            return handleRequest('GET','/user',data)
        }

    }
}