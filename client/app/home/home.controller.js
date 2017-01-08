(function () {
    'use strict'

    angular.module('angstarterapp')
        .controller('HomeController', HomeController );


    HomeController.$inject = ['dataService', 'notifier', '$route', '$log'];
    function HomeController(dataService, notifier, $route, $log) {

        var vm = this;
        vm.allHops = [];
        vm.allFermentables = []
        vm.hopCount = 0;
        vm.fermentableCount = 0;
        vm.message = 'Welcome to Angular Starter App 1!';
        vm.refresh = refresh;

        activate();


        function activate() {
            loadData();
        }

        function refresh() {
            $log.debug($route.current);
            $log.debug($route.routes);
            $route.reload();
        }


        function loadData() {
            dataService.getHops()
                .then(function(hops) {
                    vm.allHops = hops;
                    vm.hopCount = hops.length;
                })
                .catch(showError);

            dataService.getFermentables()
                .then(function(data) {
                    vm.allFermentables = data;
                    vm.fermentableCount = data.length;
                })
                .catch(showError);
        }


        function showError(message) {
            notifier.error(message);
        }

    }

}());