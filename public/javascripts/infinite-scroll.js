angular.module('infiniteScroll', [])
    .directive('infiniteScroll', function ($window) {
        return {
            link:function (scope, element, attrs) {
                var e = element[0];

                element.bind('scroll', function () {
                    if (scope.canLoad && e.scrollTop + e.offsetHeight >= e.scrollHeight) {
                        scope.$apply(attrs.infiniteScroll);
                    }
                });
            }
        }
    })
