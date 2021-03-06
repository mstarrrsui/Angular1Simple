(function () {
    'use strict';

    angular.module('angstarterapp')
        .factory('dataService', dataService);

    dataService.$inject = ['$http', '$q', '$log', '$timeout'];
    function dataService($http, $q, $log, $timeout) {

        var readyPromise;

        var service = {
            getHops: getHops,
            getHop: getHop,
            getFermentables: getFermentables,
            getRoles: getRoles,
            ready: ready
        };

        return service;

        function getHops() {
            return $http.get('/api/hops')
                .then(getHopsComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getHops')(message);
                    $location.url('/');
                });

            function getHopsComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getFermentables() {
            return $http.get('/api/fermentables')
                .then(getFermentablesComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getFermentables')(message);
                    $location.url('/');
                });

            function getFermentablesComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getHop(id) {
            return $http.get('/api/hop/' + id)
                .then(getHopComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getHops')(message);
                    $location.url('/');
                });

            function getHopComplete(data, status, headers, config) {
                return data.data;
            }
        }


        function getRoles() {
            return $http.get('http://localhost/winauthapi/api/roles/getroles', {withCredentials: true})
                .then(getRolesComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getRoles')(message);
                    $location.url('/');
                });

            function getRolesComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getReady() {
            if (!readyPromise) {
                // Apps often pre-fetch session data ("prime the app")
                // before showing the first view.
                // This app doesn't need priming but we add a
                // no-op implementation to show how it would work.
                logger.info('Primed the app data');
                readyPromise = $q.when(service);
            }
            return readyPromise;
        }

        function ready(promisesArray) {
            return getReady()
                .then(function() {
                    return promisesArray ? $q.all(promisesArray) : readyPromise;
                })
                .catch(exception.catcher('"ready" function failed'));
        }

    }

}());