(function () {
    'use strict';

    angular.module('angstarterapp')
        .controller('HopsController', HopsController);

    HopsController.$inject = [dataService, notifier];
    function HopsController(dataService, notifier) {

        var vm = this;

        dataService.getHops()
            .then(function(hops) {
                vm.allHops = hops;
            })
            .catch(showError);

        function showError(message) {
            notifier.error(message);
        }

    }

}());