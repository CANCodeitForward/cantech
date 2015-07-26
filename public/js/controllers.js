'use strict';

/* Controllers */
var cantechControllers = angular.module('cantechControllers', []);

cantechControllers.controller('NavCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('/api/sessions').success(function (data) {
            $scope.sessions = data.results;
            $scope.toggleSession = function (session) {
                session.toggle = session.toggle ? null : 'x-show';
            };
        });
    }]);

cantechControllers.controller('WorkerCtrl', ['$scope', '$http', '$routeParams', '$filter', '$timeout',
    function ($scope, $http, $routeParams, $filter, $timeout) {
        $http.get('/api/class/' + $routeParams.id + "/worker_registration").success(function (data) {
            $scope.volunteers = $filter('filter')(data.results, function(worker) { return worker.type == "Volunteer"; })
            $scope.staff = $filter('filter')(data.results, function(worker) { return worker.type == "Staff"; })

            $timeout(function () { // You might need this timeout to be sure its run after DOM render.
                $('.time-picker').each(function(index, elem) {
                    var picker = $(elem).pickatime({
                        interval: 5
                    });
                    if ($(elem).data('hour') !== "") {
                        picker.pickatime('picker').set('select', [$(elem).data('hour'), $(elem).data('minute')]);
                    }
                    $(elem).change(function(e) {
                        var time = $(this).pickatime('picker').get('select');
                        var workerId = $(this).data('workerId');
                        var type = $(this).data('type');
                        var hour = time.hour;
                        var mins = time.mins;
                        var url = '/api/class/' + $routeParams.id + '/attendance_worker/' + workerId;
                        var postData = {
                            type: type,
                            hour: hour,
                            minute: mins
                        };

                        if ($(elem).data('has-been-set')) {
                            $http.patch(url, postData);
                        } else {
                            $http.post(url, postData);
                        }
                        $(elem).data('edited-once', true);
                    });
                })
            }, 0, false);
        });
    }]);

cantechControllers.controller('ParticipantCtrl', ['$scope', '$http', '$routeParams', '$filter', '$timeout',
    function ($scope, $http, $routeParams, $filter, $timeout) {
        $http.get('/api/class/' + $routeParams.id + "/participant_registration").success(function (data) {
            $scope.participants = data.results;

            $timeout(function () { // You might need this timeout to be sure its run after DOM render.
                $('.time-picker').each(function(index, elem) {
                    var picker = $(elem).pickatime({
                        interval: 5
                    });
                    if ($(elem).data('hour') !== "") {
                        picker.pickatime('picker').set('select', [$(elem).data('hour'), $(elem).data('minute')]);
                    }
                    $(elem).change(function(e) {
                        var time = $(this).pickatime('picker').get('select');
                        var participantId = $(this).data('participantId');
                        var type = $(this).data('type');
                        var hour = time.hour;
                        var mins = time.mins;
                        var url = '/api/class/' + $routeParams.id + '/attendance_participant/' + participantId;
                        var postData = {
                            type: type,
                            hour: hour,
                            minute: mins
                        };

                        if ($(elem).data('has-been-set')) {
                            $http.patch(url, postData);
                        } else {
                            $http.post(url, postData);
                        }
                        $(elem).data('edited-once', true);
                    });
                })
            }, 0, false);
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
