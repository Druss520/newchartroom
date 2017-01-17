/**
 * Created by yanglizhuo on 16/12/16.
 */

angular.module('webapp').controller('signcontroller',['$window','$scope','signService','userinfofactory',signcontroller]);

function signcontroller($window,$scope,signService,userinfofactory) {

    $scope.user = {};
    $scope.sign = {};

    $scope.signup1 = function () {
        if($scope.sign.username==''){
            $scope.hehe1 = "用户名不能为空";
            return;
        }
        if($scope.sign.password==''){
            $scope.hehe1 = "密码不能为空";
            return;
        }
        // console.log($scope.sign.username)
        // console.log($scope.sign.password)
        signService.signup($scope.sign).then(
            function (data) {
                // console.log(data);
                if(data.data.data==="hehe"){
                    $scope.hehe1 = "用户名已存在"
                }
                else{
                    userinfofactory.setter(data.name);
                    $window.location.href = '/'
                }
            },
            function (error) {
                $scope.hehe1 = error;
            }
        )
    };

    $scope.signin1 = function () {
        if($scope.user.username==''){
            $scope.hehe2 = "用户名不能为空";
            return;
        }
        if($scope.user.password.length==0){
            $scope.hehe2 = "密码不能为空";
            return;
        }
        // console.log($scope.sign.username)
        // console.log($scope.sign.password)
        signService.signin($scope.user).then(

            function (data) {
                // console.log(data);
                if(data.data.data==="hehe"){
                    $scope.hehe2 = "用户名或密码错误"
                }
                else{
                    userinfofactory.setter(data.name);
                    $window.location.href = '/'
                }
            },
            function (error) {
                $scope.hehe2 = error;
            }

        )
    };

}