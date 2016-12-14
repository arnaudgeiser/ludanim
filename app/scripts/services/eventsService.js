'use strict';

angular.module('ludanim').factory('eventsService', ['$resource', '$rootScope','$window', ($resource, $rootScope, $window) => {
	var eventUrl = "events/:id";
	var reservationsUrl = "event/:id/reservations";
	var resourceEvents = $resource(eventUrl, { id: '@id' }, {
		showProgramme: {
			url: eventUrl + "/programme",
			method: 'GET'
		},
		sendEmail: {
			url: eventUrl + "/send",
			method: 'PUT'
		},
		addReservation: {
			url: eventUrl + "/reservations",
			method: 'POST'
		}
	});

	var resourceReservations = $resource("reservations/:id");

	return {
		printProgramme: (event) => {
			$window.open(`${URL}events/${event.id}/print`);
		},
		addReservation: (ev, reservation) => {
			return resourceEvents.addReservation({ id: ev.id }, reservation).$promise;
		},
		deleteReservation: (reservation) => {
			return resourceReservations.delete({ id: reservation.id }).$promise;
		},
		send: (event, email, success, error) => {
			return resourceEvents.sendEmail({ id: event.id }, email).$promise;
		}
	};
}]);
