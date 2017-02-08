'use strict';

/**
 * @ngdoc overview
 * @name metroApp
 * @description
 * # metroApp
 *
 * Main module of the application.
 */
angular
  .module('metroApp', [
    'ngRoute',
    'geolocation',
    'ngCordova'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
