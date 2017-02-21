'use strict'
angular.module('ludanim').factory('festivalService', ['$http','$location', function($http, $location) {
	return {
		findFestivals : (idFestival) => $http.get('festivals').then((response) => response.data),
		findEvents : (idFestival) => $http.get(`festivals/${idFestival}/events`).then((response) => response.data),
		print : (idFestival) => window.open(`${URL}festivals/${idFestival}/print`),
		printByDay : (idFestival, day) => window.open(`${URL}festivals/${idFestival}/byday/${day}/print`),
		sendNotification : (notification) => $http.post("notifications/send", notification)
	}
}]);
