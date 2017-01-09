(function() {
    'use strict';

    var app = angular.module('angstarterapp', ['ui.router','ngResource']);

    app.config(AppConfig);


    AppConfig.$inject = ['$logProvider', '$stateProvider', '$urlRouterProvider'];
    function AppConfig ($logProvider, $stateProvider, $urlRouterProvider) {

        $logProvider.debugEnabled(true);

        //$locationProvider.hashPrefix('!');

        //$locationProvider.html5Mode(false);

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                controller: 'HomeController',
                controllerAs: 'home',
                templateUrl: '/app/home/home.html'
            })
            .state('hops', {
                url: '/hops',
                controller: 'HopsController',
                controllerAs: 'vm',
                templateUrl: '/app/hops/hops.html'
            })
            .state('fermentables', {
                url: '/fermentables',
                controller: 'FermentablesController',
                controllerAs: 'vm',
                templateUrl: '/app/fermentables/fermentables.html'
            });
            // .when('/hops', {
            //     controller: 'HopsController',
            //     controllerAs: 'vm',
            //     templateUrl: '/app/hops/hops.html'
            // })
            // .when('/fermentables', {
            //     controller: 'FermentablesController',
            //     controllerAs: 'vm',
            //     templateUrl: '/app/fermentables/fermentables.html',
            //     resolve: {
            //         fermentables: function (dataService) {
            //             return dataService.getFermentables();
            //         }
            //     }
            // })
            // .when('/activities', {
            //     controller: 'AllActivitiesController',
            //     controllerAs: 'activities',
            //     templateUrl: '/app/templates/allActivities.html',
            //     resolve: {
            //         activities: function (dataService) {
            //             return dataService.getAllActivities();
            //         }
            //     }
            // })
            //.otherwise('/');

    };


    // app.run(AppRun);
    //
    // AppRun.$inject = ['$rootScope','$log'];
    // function AppRun($rootScope, $log) {
    //     $rootScope.$on('$routeChangeSuccess',function (event,current,previous) {
    //
    //         $log.debug('successfully changed routes');
    //         $log.debug(event);
    //         $log.debug(current);
    //         $log.debug(previous);
    //
    //     });
    // }

    app.run(['$rootScope', '$log', function($rootScope, $log) {

        //$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //
        //    $log.debug('successfully changed states');
        //
        //    $log.debug('event', event);
        //    $log.debug('toState', toState);
        //    $log.debug('toParams', toParams);
        //    $log.debug('fromState', fromState);
        //    $log.debug('fromParams', fromParams);
        //});

        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {

            $log.error('The requested state was not found: ', unfoundState);

        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {

            $log.error('An error occurred while changing states: ', error);

            $log.debug('event', event);
            $log.debug('toState', toState);
            $log.debug('toParams', toParams);
            $log.debug('fromState', fromState);
            $log.debug('fromParams', fromParams);
        });

    }]);

}());