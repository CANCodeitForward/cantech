'use strict';

/* Controllers */
var cantechControllers = angular.module('cantechControllers', []);

cantechControllers.controller('NavCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('sessions').success(function (data) {
            $scope.sessions = data.results;
        });
    }]);

cantechControllers.controller('ClassCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        //$http.get('sessions').success(function (data) {
        //    $scope.sessions = data.results;
        //});
        if ($routeParams.id) {
            $scope.class = 'hi';
        }
    }]);
