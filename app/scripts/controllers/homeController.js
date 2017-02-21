'use strict';
angular.module('ludanim').controller('HomeCtrl', ['$scope', '$http' ,'$resource', '$rootScope' ,'$timeout','$uibModal', 'eventsService', 'Notification','festivalService',
	function ($scope, $http ,$resource, $rootScope ,$timeout ,$uibModal, eventsService, Notification, festivalService) {
		$scope.events = [];
		$scope.day = null;

		let idFestival =() => {
			var festival = $rootScope.festival;
			if(festival) {
				return festival.id;
			} else {
				return null;
			}
		}

		let find = () => {
			festivalService.findEvents(idFestival()).then((data) => {
				$scope.events = data;
				$scope.filteredEvents = data;
			});
		}

		$scope.refresh = () => {
			find();
		}

		$scope.numberOf = (event) => event.reservations.reduce((acc, r) => acc+r.attendees.length, 0);

		$scope.deleteReservation = (event, reservation) => {
			function deleteReservation() {
				eventsService.deleteReservation(reservation)
										 .then(() => {
											  Notification.warning('Le joueur ne participe plus à "' + event.event_name + '"');
												event.reservations = event.reservations.filter((r) => r.id!==reservation.id);
				});
			}

			if(reservation.username) {
				$uibModal.open({
					templateUrl: 'removeReservation.html',
					controller: 'RemoveReservationCtrl',
				}).result.then(() => {
					deleteReservation();
				})
			} else {
				deleteReservation();
			}
		}

		$scope.sendEmail = (event) => {
			var modalInstance = $uibModal.open({
				templateUrl: 'sendEmailContent.html',
				controller: 'SendEmailCtrl',
				resolve: {
					ev: function ev() {
						return event;
					}
				}
			});
		};

		$scope.sendNotification = () => {
			$uibModal.open({
				templateUrl: 'sendNotification.html',
				controller: 'SendNotificationCtrl'
			}).result.then((notification) => {
				festivalService.sendNotification(notification).then(() => {
					Notification.success("Votre notification a bien été envoyée !");
				});
			});
		}

		$scope.openPartiesSpontanees = () => {
			$uibModal.open({
				templateUrl: 'partiesSpontanees.html',
				controller: 'PartiesSpontaneesCtrl'
			});
		}

		function filterByDay(events, day) {
			return events.filter((e) => moment(e.event_start_date).day() == day);
		}

		$scope.filterFriday = () => {
			$scope.filteredEvents = filterByDay($scope.events, 5);
			$scope.day = 5;
		}

		$scope.filterSaturday = () => {
			$scope.filteredEvents = filterByDay($scope.events, 6);
			$scope.day = 6;
		}

		$scope.filterSunday = () => {
			$scope.filteredEvents = filterByDay($scope.events, 0);
			$scope.day = 0;
		}

		$scope.unfilter = () => {
			$scope.filteredEvents = $scope.events;
			$scope.day = null;
		}

		$scope.formattedDay = (event) => {
			var day = moment(event.event_start_date).format('dddd');
			return day.charAt(0).toUpperCase() + day.slice(1);
		}

		$scope.addReservation = (event) => {
			var modalInstance = $uibModal.open({
				templateUrl: 'addReservation.html',
				controller: 'AddReservationCtrl',
				resolve: {
					ev: function ev() {
						return event;
					}
				}
			}).result.then((event) => {
				let index = $scope.events.findIndex((e) => e.id===event.id);
				$scope.events[index].reservations = event.reservations;
			});
		};

		$scope.printProgramme = () => {
			festivalService.print(idFestival());
		};

		$scope.printProgrammeByDay = () => {
			if(!$scope.day && $scope.day!==0) {
				Notification.warning("Impossible d'imprimer le programme sans avoir sélecitonné de jour");
			} else {
				festivalService.printByDay(idFestival(), $scope.day);
			}
		}

		$scope.print = (event) => eventsService.printProgramme(event);

		find();
}]).controller('SendEmailCtrl', ['$scope', 'eventsService', 'ev', '$uibModalInstance', 'Notification', function ($scope, eventsService, event, $uibModalInstance, Notification) {
	$scope.submit = () => {
		eventsService.send(event, $scope.email).then(() => {
			Notification.success('Un email a été envoyé aux participants de "' + event.event_name + '"');
			$uibModalInstance.close();
		});
	};
}]).controller('AddReservationCtrl', ['$scope', 'eventsService', 'ev', '$uibModalInstance', 'Notification', function ($scope, eventsService, ev, $uibModalInstance, Notification) {
	$scope.submit = () => {
		let reservation = $scope.reservation;
		let reservationAttempt = {
			reservation : reservation,
			event_id : ev.id
		}
		eventsService.addReservation(ev, reservationAttempt).then((event) => {
			$uibModalInstance.close(event);
			Notification.success('Le joueur ' + reservation.name + ' est inscrit à "' + event.event_name + '"');
		}, (e) => {
			Notification.error("L'inscription n'a pas pu être effectué");
		});
	};
}]).controller('RemoveReservationCtrl', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
	$scope.validate = () => {
		$uibModalInstance.close();
	}

	$scope.close = () => {
		$uibModalInstance.dismiss();
	}
}]).controller('SendNotificationCtrl', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
	$scope.submit = (notification) => {
		$uibModalInstance.close(notification);
	}
	$scope.close = () => {
		$uibModalInstance.dismiss();
	}
}]).controller('PartiesSpontaneesCtrl', ['$scope','$uibModalInstance','festivalService', function($scope, $uibModalInstance, festivalService) {
	festivalService.findPartiesSpontanees().then((parties) => {
		$scope.parties = parties;
	});
}]);
