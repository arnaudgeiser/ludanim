'use strict';

angular.module('ludexploit').controller('LoginCtrl', ["$scope","$cookies", "$http","$rootScope","festivalService","Notification",
function ($scope, $cookies, $http, $rootScope,festivalService,Notification) {

	festivalService.findFestivals().then((data) => {
		$scope.festival = data.sort((a,b) => b.id-a.id)[0];
		$scope.festivals = data;
		$rootScope.festival = $scope.festival
	});

	$scope.changeFestival = () => $rootScope.festival = $scope.festival

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
