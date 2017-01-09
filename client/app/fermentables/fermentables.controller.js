(function () {
    'use strict';

    angular.module('angstarterapp')
        .controller('FermentablesController', FermentablesController);

    FermentablesController.$inject = ['dataService', 'notifier'];
    function FermentablesController(dataService, notifier) {

        var vm = this;
        vm.allFermentables = [];
        vm.message = 'Fermentables'

        activate();

        function activate() {
            return loadData().then(function() {
                //
            });
        }

        function loadData() {
            return dataService.getFermentables()
                .then(function(data) {
                    vm.allFermentables = data;
                })
                .catch(showError);
        }



        function showError(message) {
            notifier.error(message);
        }

    }

}());