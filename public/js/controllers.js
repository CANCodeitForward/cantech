'use strict';

/* Controllers */
var cantechControllers = angular.module('cantechControllers', []);

cantechControllers.controller('PhoneListCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('phones/phones.json').success(function (data) {
            $scope.phones = data;
        });

        $scope.orderProp = 'age';
    }]);

cantechControllers.controller('NavCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('sessions').success(function (data) {
            $scope.sessions = data.results;
        });
    }]);
