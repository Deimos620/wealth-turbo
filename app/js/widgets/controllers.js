'use strict';

define(['angular', 'ui-bootstrap'], function(angular) {

    let widgetsControllers = angular.module('widgetsControllers', []);

    widgetsControllers.controller('widgetDashboard_whatIOwn', ['$scope', '$ocModal', ($scope, $ocModal) => {
        $scope.openAddModal = function(type) {
            $ocModal.open({
                id: 'add_' + type + '_select',
                url: 'partials/modals/add_' + type + '_select.html',
                controller: 'ModalController_add',
                closeOnEsc: false,
                cls: 'fade-in',
                init: {
                    type: type,
                    start: '',
                    isFollowModal: false
                }
            })
        }
    }]);

    widgetsControllers.controller('widgetDashboard_whatIOwe', ['$scope', '$ocModal', ($scope, $ocModal) => {
        $scope.openAddModal = function(type) {
            $ocModal.open({
                id: 'add_' + type + '_select',
                url: 'partials/modals/add_' + type + '_select.html',
                controller: 'ModalController_add',
                cls: 'fade-in',
                closeOnEsc: false,
                init: {
                    type: type,
                    start: '',
                    isFollowModal: false
                }
            })
        }
    }]);

    widgetsControllers.controller('widgetDashboard_myOtherAccounts', ['$scope', '$ocModal', ($scope, $ocModal) => {
        $scope.openAddModal = function(type) {
            $ocModal.open({
                id: 'add_' + type + '_select',
                url: 'partials/modals/add_' + type + '_select.html',
                controller: 'ModalController_add',
                closeOnEsc: false,
                cls: 'fade-in',
                init: {
                    type: type,
                    start: '',
                    isFollowModal: false
                }
            })
        }
    }]);

    widgetsControllers.controller('widgetDashboard_myNetWealth', ['$scope', ($scope) => {
    }]);

    widgetsControllers.controller('widgetDashboard_myInsurance', ['$scope', '$ocModal', ($scope, $ocModal) => {
        $scope.openAddModal = function(type) {
            $ocModal.open({
                id: 'add_' + type + '_select',
                url: 'partials/modals/add_' + type + '_select.html',
                controller: 'ModalController_add',
                closeOnEsc: false,
                cls: 'fade-in',
                init: {
                    type: type,
                    start: '',
                    isFollowModal: false
                }
            })
        }
    }]);

    widgetsControllers.controller('widgetDashboard_growMyWealth', ['$scope', ($scope) => { /** DO STUFF */ }]);

    widgetsControllers.controller('widget_addressSearch', ['$scope', 'dataService', ($scope, dataService) => {
        $scope.addressEntryMode = "flat";
        $scope.addressStructure = "physical";
        $scope.addressItem = {
            'id': null,
            'addressText': null,
            'countryId': null,
            'propertyName': null,
            'unitNumber': null,
            'streetNumber': null,
            'poBox': null,
            'streetName': null,
            'streetType': null,
            'suburb': null,
            'state': null,
            'postCode': null,
            'rpDataPropertyId': null,
        }
        $scope.searchTerm = "";
        $scope.searchResults = [];

        $scope.clearAddress = function() {
            $scope.addressItem = {
                'id': null,
                'addressText': null,
                'countryId': null,
                'propertyName': null,
                'unitNumber': null,
                'streetNumber': null,
                'poBox': null,
                'streetName': null,
                'streetType': null,
                'suburb': null,
                'state': null,
                'postCode': null,
                'rpDataPropertyId':null
            };
            $scope.address = null;
        }
        $scope.selectAddress = function(x) {
            if(x.id == null || x.id == undefined) {
                $scope.addressItem = {
                    'id': null,
                    'addressText': x.line,
                    'countryId': x.countryId,
                    'propertyName': x.propertyName,
                    'unitNumber': x.unitNumber,
                    'streetNumber': x.streetNumber,
                    'poBox': x.poBox,
                    'streetName': x.streetName,
                    'streetType': x.streetTypeId,
                    'suburb': x.suburb,
                    'state': x.stateId,
                    'postCode': x.postCode,
                    'rpDataPropertyId': x.rp
                }
            }
            else
            {
                $scope.addressItem = {
                    'id': x.id,
                    'addressText': x.line,
                    'countryId': x.countryId,
                    'propertyName': x.propertyName,
                    'unitNumber': x.unitNumber,
                    'streetNumber': x.streetNumber,
                    'poBox': x.poBox,
                    'streetName': x.streetName,
                    'streetType': x.streetTypeId,
                    'suburb': x.suburb,
                    'state': x.stateId,
                    'postCode': x.postCode,
                    'line': x.line,
                    'rpDataPropertyId': null,
                }
            }
            $scope.address = $scope.addressItem;
            $scope.searchTerm = "";
            $scope.searchResults = [];
        }
        $scope.findAddress = function(event) {
            let searchTerm = event.target.value;
            if (searchTerm.length > 4) {
                dataService.get('/add/search/' + searchTerm).then(function(data) {
                    $scope.searchResults = data;
                })
            }
        }
        if (!$scope.isAdd && $scope.address != null) {
            $scope.addressItem = $scope.address;
        }
    }]);

    widgetsControllers.controller('widget_navConnectTo', ['$scope', 'safeApply', ($scope, safeApply) => {
        $scope.institutions = [];
        $scope.openInstitution = function (instId) {
            $.ewise.login(instId);
        }
        $.ewise.initialise(function (status) {
            console.log("widget_navConnectTo : " + status);
            if (status == "success") {
                $.ewise.getUserProfile(function (response) {
                    if (response.status == "success") {
                        $scope.institutions = response.data.userprofile;
                        safeApply($scope);
                    }
                });
            }
        });
    }]);
});