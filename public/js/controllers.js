'use strict';

/* Controllers */
var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('phones/phones.json').success(function (data) {
            $scope.phones = data;
        });

        $scope.orderProp = 'age';
    }]);

phonecatControllers.controller('NavCtrl', ['$scope', '$http',
    function ($scope, $http) {
        //$http.get('phones/' + $routeParams.phoneId + '.json').success(function(data) {
        //    $scope.phone = data;
        //});
        $scope.sessions = [
            {
                title: 'I CAN Swim (ICS-101)',
                dates: 'April 11, 2015 - May 30, 2015<br>Saturday, 10:00 - 13:30',
                status: 'TODAY'
            }
        ]
    }]);
