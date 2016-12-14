'use strict';

var URL = "http://localhost:3000/";

angular.module('ludanim', ['ngRoute', 'ngResource','ngCookies', 'ui.bootstrap', 'ui-notification']).config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl'
  }).otherwise({
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  });
}]).factory('globalInterceptor', ['$q', '$injector','$location', function ($q, $injector, $location) {
  return {
    request: function request(config) {
      if (config.url.indexOf('html') != -1) return config;
      config.url = URL + config.url;
      return config;
    },

    requestError: function requestError(rejection) {
      return $q.reject(rejection);
    },

    response: function response(_response) {
      return _response;
    },

    responseError: function responseError(rejection) {
      if (rejection.data && rejection.data.length > 0) {
        if(rejection.status===401 || rejection.status===403) {
          $location.path('login');
        }
        $injector.get('Notification').error(rejection.data);
      }
      return $q.reject(rejection);
    }
  };
}]).config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  $httpProvider.interceptors.push('globalInterceptor');

  moment.locale('fr');
}]).run(['$rootScope','$cookies','$location','$http','$log', function ($rootScope, $cookies, $location, $http, $log) {
  var token = $cookies.get('Authorization');
  var festival = $cookies.getObject('festival');

  if(!token || !festival) {
    $log.debug('Pas de festival ou de token')
    $location.path('#login');
  }

  $http.defaults.headers.common['Authorization'] = token;
  $rootScope.festival = festival;
  $rootScope.url = URL;
}]);
