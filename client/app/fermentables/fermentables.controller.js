(function () {
    'use strict';

    angular.module('angstarterapp')
        .controller('FermentablesController', FermentablesController);

    FermentablesController.$inject = ['dataService', 'notifier', 'fermentables'];
    function FermentablesController(dataService, notifier, fermentables) {

        var vm = this;
        vm.allFermentables = fermentables;
        vm.message = 'Fermentables'

        activate();

        function activate() {
            //return loadData().then(function() {
                //setCurrPageData(1);
                //logger.info('Activated Hops View');
            //});
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