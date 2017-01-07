(function () {

    angular.module('angstarterapp')
        .factory('notifier', notifier);

    function notifier() {

        toastr.options = {
            "showDuration": "300",
            "timeOut": "2000"
        };

        return {
            success: success,
            error: error
        };

        function success(message) {
            toastr.success(message);
        }

        function error(message) {
            toastr.error(message);
        }
    }

}());