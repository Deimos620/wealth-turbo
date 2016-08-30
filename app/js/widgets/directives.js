'use strict';
define(['angular'], function (angular) {
    angular
        .module('widgetDirectives', [])
        .directive('addressSearch', function() {
            return {
                restrict: "E",
                templateUrl: "partials/widgets/addressSearch.html",
                controller: "widget_addressSearch",
                scope: {
                    address: '=model'
                }
            };
        });
});