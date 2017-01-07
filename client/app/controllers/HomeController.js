(function () {

    angular.module('angstarterapp')
        .controller('HomeController', ['dataService', 'notifier', HomeController]);

    function HomeController(dataService, notifier) {

        var vm = this;

        vm.message = 'Welcome to Angular Starter App 1!';

        dataService.getAllSchools()
            .then(function(schools) {
                vm.allSchools = schools;
                vm.schoolCount = schools.length;
            })
            .catch(showError);

        dataService.getAllClassrooms()
            .then(function(classrooms) {
                vm.allClassrooms = classrooms;
                vm.classroomCount = classrooms.length;
            })
            .catch(showError);

        dataService.getAllActivities()
            .then(function(activities) {
                vm.allActivities = activities;
                vm.activityCount = activities.length;
            })
            .catch(showError);

        function showError(message) {
            notifier.error(message);
        }

    }

}());