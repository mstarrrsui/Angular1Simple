(function() {
    'use strict';

    var app = angular.module('angstarterapp', ['ngRoute','ngResource']);

    app.config(AppConfig);


    AppConfig.$inject = ['$logProvider', '$routeProvider', '$locationProvider'];
    function AppConfig ($logProvider, $routeProvider, $locationProvider) {

        $logProvider.debugEnabled(true);

        //$locationProvider.hashPrefix('!');

        $locationProvider.html5Mode(false);

        $routeProvider
            .when('/', {
                controller: 'HomeController',
                controllerAs: 'home',
                templateUrl: '/app/home/home.html'
            })
            .when('/hops', {
                controller: 'HopsController',
                controllerAs: 'vm',
                templateUrl: '/app/hops/hops.html'
            })
            .when('/fermentables', {
                controller: 'FermentablesController',
                controllerAs: 'vm',
                templateUrl: '/app/fermentables/fermentables.html',
                resolve: {
                    fermentables: function (dataService) {
                        return dataService.getFermentables();
                    }
                }
            })
            .when('/activities', {
                controller: 'AllActivitiesController',
                controllerAs: 'activities',
                templateUrl: '/app/templates/allActivities.html',
                resolve: {
                    activities: function (dataService) {
                        return dataService.getAllActivities();
                    }
                }
            })
            .otherwise('/');

    };


    app.run(AppRun);

    AppRun.$inject = ['$rootScope','$log'];
    function AppRun($rootScope, $log) {
        $rootScope.$on('$routeChangeSuccess',function (event,current,previous) {

            $log.debug('successfully changed routes');
            $log.debug(event);
            $log.debug(current);
            $log.debug(previous);

        });
    }

}());