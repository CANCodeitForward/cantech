'use strict';

/* Controllers */
var cantechControllers = angular.module('cantechControllers', []);

cantechControllers.controller('NavCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('/api/sessions').success(function (data) {
            $scope.sessions = data.results;
        });
    }]);

cantechControllers.controller('WorkersCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        $http.get('sessions').success(function (data) {
            $scope.sessions = data.results;
        });
    }]);

cantechControllers.controller('ParticipantsCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        $http.get('/api/class/' + $routeParams.id + "/participant_registration").success(function (data) {
            $scope.participants = data.results;
        });
    }]);



cantechControllers.controller('FooterCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        $scope.route = $routeParams;
    }]);
