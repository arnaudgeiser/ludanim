'use strict';

var URL = "http://localhost:3000/";

angular.module('ludexploit', ['ngRoute', 'ngResource','ngCookies', 'ui.bootstrap', 'ui-notification']).config(['$routeProvider', function ($routeProvider) {
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
        if(rejection.status===401) {
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
}]).run(['$rootScope','$cookies','$http', function ($rootScope, $cookies, $http) {
  var token = $cookies.get('Authorization');
  $http.defaults.headers.common['Authorization'] = token;
  $rootScope.url = URL;
}]);
