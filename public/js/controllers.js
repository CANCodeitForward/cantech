'use strict';

/* Controllers */
var cantechControllers = angular.module('cantechControllers', []);

cantechControllers.controller('NavCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('/api/sessions').success(function (data) {
            $scope.sessions = data.results;
        });
    }]);

cantechControllers.controller('WorkerCtrl', ['$scope', '$http', '$routeParams', '$filter',
    function ($scope, $http, $routeParams, $filter) {
        $http.get('/api/class/' + $routeParams.id + "/worker_registration").success(function (data) {
            $scope.volunteers = $filter('filter')(data.results, function(worker) { return worker.type == "Volunteer"; })
            $scope.staff = $filter('filter')(data.results, function(worker) { return worker.type == "Staff"; })
        });
    }]);

cantechControllers.controller('ParticipantCtrl', ['$scope', '$http', '$routeParams', '$filter',
    function ($scope, $http, $routeParams, $filter) {
        $http.get('/api/class/' + $routeParams.id + "/participant_registration").success(function (data) {
            $scope.participants = data.results;
        });
    }]);



cantechControllers.controller('FooterCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        $scope.route = $routeParams;
    }]);

cantechControllers.controller('SplashCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        $scope.route = $routeParams;
    }]);
