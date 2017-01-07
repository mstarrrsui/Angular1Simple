(function() {

    var app = angular.module('angstarterapp', ['ngRoute','ngResource']);

    app.config(AppConfig);


    AppConfig.$inject = ['$logProvider', '$routeProvider', '$locationProvider'];
    function AppConfig ($logProvider, $routeProvider, $locationProvider) {

        $logProvider.debugEnabled(true);

        //$locationProvider.hashPrefix('!');

        $locationProvider.html5Mode(true);

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
            .when('/classrooms', {
                controller: 'AllClassroomsController',
                controllerAs: 'classrooms',
                templateUrl: '/app/templates/allClassrooms.html'
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

}());