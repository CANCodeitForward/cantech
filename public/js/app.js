'use strict';

/* App Module */
var cantechApp = angular.module('cantechApp', [
    'ngRoute',
    'cantechControllers'
]);

cantechApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/classes/:id', {
                templateUrl: 'partials/class.html',
                controller: 'ClassCtrl'
            }).
            when('/', {
                templateUrl: 'partials/splash.html',
                controller: 'ClassCtrl'
            })
    }]);
