'use strict';

angular.module('ludanim').controller('LoginCtrl', ["$scope","$cookies", "$http","$rootScope","festivalService","Notification",
function ($scope, $cookies, $http, $rootScope,festivalService,Notification) {
	function changeFestival(festival) {
		$rootScope.festival = festival;
		$cookies.putObject('festival', festival);
		console.log(festival);
	}

	festivalService.findFestivals().then((data) => {
		$scope.festival = data.sort((a,b) => b.id-a.id)[0];
		$scope.festivals = data;
		changeFestival($scope.festival);
	});

	$scope.changeFestival = changeFestival;

	$scope.submit = () => {
		var token = 'Basic ' + btoa($scope.user.username + ":" + $scope.user.password);
		$cookies.put('Authorization', token);
		$http.defaults.headers.common['Authorization'] = token;

		$http.post('login').then((data) => {
			if(data.data) {
				window.location = '#/home';
			} else {
				Notification.error("Authentification échouée");
			}
		});
		return false;
	};
}]);
