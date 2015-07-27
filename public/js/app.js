'use strict';

/* App Module */
var cantechApp = angular.module('cantechApp', [
    'ngRoute',
    'cantechControllers'
]);

cantechApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/classes/:id/workers', {
                templateUrl: 'partials/workers.html',
                controller: 'WorkerCtrl'
            }).
            when('/classes/:id/participants', {
                templateUrl: 'partials/participants.html',
                controller: 'ParticipantCtrl'
            }).
            when('/classes/:id/reports', {
                templateUrl: 'partials/report.html',
                controller: 'ReportsCtrl'
            }).
            when('/', {
                templateUrl: 'partials/splash.html',
                controller: 'SplashCtrl'
            })
    }]);
