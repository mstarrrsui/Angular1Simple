(function () {

    angular.module('angstarterapp')
        .controller('HomeController', ['dataService', 'notifier', HomeController]);

    function HomeController(dataService, notifier) {

        var vm = this;

        vm.message = 'Welcome to Angular Starter App 1!';

        dataService.getHops()
            .then(function(hops) {
                vm.allHops = hops;
                vm.hopCount = hops.length;
            })
            .catch(showError);



        function showError(message) {
            notifier.error(message);
        }

    }

}());