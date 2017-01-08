(function () {
    'use strict'

    angular.module('angstarterapp')
        .controller('HomeController', HomeController );


    HomeController.$inject = ['dataService', 'notifier', '$route'];
    function HomeController(dataService, notifier, $route) {

        var vm = this;
        vm.allHops = [];
        vm.hopCount = 0;
        vm.message = 'Welcome to Angular Starter App 1!';
        vm.refresh = refresh;

        activate();


        function activate() {
            return loadData().then(function() {
                //setCurrPageData(1);
                //logger.info('Activated Hops View');
            });
        }

        function refresh() {
            $route.reload();
        }


        function loadData() {
            return dataService.getHops()
                .then(function(hops) {
                    vm.allHops = hops;
                    vm.hopCount = hops.length;
                })
                .catch(showError);
        }


        function showError(message) {
            notifier.error(message);
        }

    }

}());