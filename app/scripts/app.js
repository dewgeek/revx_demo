'use strict';

/**
 * @ngdoc overview
 * @name revxApp
 * @description
 * # revxApp
 *
 * Main module of the application.
 */
angular
  .module('revxApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    'ui.grid',
    'ngResource',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
