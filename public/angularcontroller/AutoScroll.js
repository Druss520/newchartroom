/**
 * Created by yanglizhuo on 16/12/20.
 */

angular.module('webapp').directive('autoScrollTop',function ($timeout) {
    return{
        link:function (scope,element,attrs) {
            scope.$on(attrs.autoScrollTop, function () {
                $timeout(function () {
                    var h = element[0].scrollHeight;
                    console.log(h);
                    angular.element(element)[0].scrollTop = h;
                });
            });
        }
    }
});