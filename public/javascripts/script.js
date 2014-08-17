//var images = [{"source":"http://placehold.it/225x250&text=fart"},{"source":"http://placehold.it/225x250&text=loot"},{"source":"http://placehold.it/225x250&text=pussy"},{"source":"http://placehold.it/225x250&text=money"},{"source":"http://placehold.it/225x250&text=math"},{"source":"http://placehold.it/225x250&text=knowledge"}]

var myApp = angular.module('myApp', ['infinite-scroll']);

myApp.controller('DemoController', function($scope,getShit){
	$scope.image_collection = new image_collection();
});

myApp.factory('getShit',function($http) {
	var image_collection = function() {
		this.items = [];
		this.busy = false;
	};

	image_collection.prototype.loadMore = function () { 
		if (this.busy) return;
		this.busy = true;

		$http.get('/data').success(function(data){
			var items = data;
			for (var i = 0;i <items.length; i++) {
				this.items.push(items[i].data);
			}
			this.busy = false;
		}.bind(this));
	};
});
	
