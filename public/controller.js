var app = angular.module('supercuber',['ngRoute']);


app.factory('getStuff',function($http) {
   var images_list = [];
   var L=0;   
   var addStuff = function(){  $http.get("/data").success(function(data){
     var returned_list = JSON.stringify(data);
     parsed_list = JSON.parse(returned_list);
     //console.log(parsed_list.length);
     for (var i=L;i<L+12;i++){
       images_list.push(parsed_list[i]);
       console.log(L);
     }
     L+=12;
   });
   };
   return {
     images_list: images_list,
     addStuff: addStuff
   }
});

app.config(function($routeProvider) {
    $routeProvider
        .when('/',{
            templateUrl : 'pages/home.html',
            controller : 'mainController'
        })
        .when('/view',{
            templateUrl : 'pages/view.html',
            controller : 'viewController'
        })
        .when('/about',{
            templateUrl : 'pages/about.html',
            controller : 'aboutController'
        });
    });
app.controller('mainController', function($scope,getStuff,$http) {

      $scope.data = getStuff.images_list;
      $scope.loaddata = getStuff.addStuff;
      $scope.loaddata();
      $scope.showLarge = false;
      $scope.test = "tested";
      $scope.vote = function(id){
          alert(id);
          $http.put("/data").success(alert(id));};
      
    });


app.controller('aboutController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    });

app.directive('onScrolled', function () {
    return function (scope, elm, attr) {
        var el = elm[0];

        elm.bind('scroll', function () {
            if (el.scrollTop + el.offsetHeight >= el.scrollHeight) {
                scope.$apply(attr.onScrolled);
            }
        });
    };
});

app.directive('myDraggable', ['$document', function($document) {
    return function(scope, element, attr) {
      var startX = 0, startY = -1000, x = 0, y = 0;

      element.css({
       position: 'relative',
       border: '0px solid red',
       backgroundColor: 'grey',
       cursor: 'pointer',
      });
      
      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        element.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    };
  }]);
