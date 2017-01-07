(function() {

    var app = angular.module('angstarterapp', ['ngRoute','ngResource']);

    app.config(AppConfig);


    AppConfig.$inject = ['$logProvider', '$routeProvider', '$locationProvider'];
    function AppConfig ($logProvider, $routeProvider, $locationProvider) {

        $logProvider.debugEnabled(true);

        $locationProvider.hashPrefix('!');

        //$locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                controller: 'HomeController',
                controllerAs: 'home',
                templateUrl: '/app/templates/home.html'
            })
            .when('/schools', {
                controller: 'AllSchoolsController',
                controllerAs: 'schools',
                templateUrl: '/app/templates/allSchools.html'
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
            .when('/classrooms/:id', {
                templateUrl: '/app/templates/classroom.html',
                controller: 'ClassroomController',
                controllerAs: 'classroom'
            })
            .when('/classrooms/:id/detail/:month?', {
                templateUrl: '/app/templates/classroomDetail.html',
                controller: 'ClassroomController',
                controllerAs: 'classroom'
            })
            .otherwise('/');

    };

}());