'use strict';

define(['angular'], function (angular) {

    let dropdownFactories = angular.module('dropdownFactories', []);
    
    dropdownFactories.factory('Types', ['$http', '$q', function ($http, $q) {
        var factory = {};
        var ddOptions = {};
        var apiRoot = urls.api;
        var apiURIs = {
            "institution-bank":               "/aca/group/1",
            "institution-creditCard":         "/aca/group/2",
            "institution-investment":         "/aca/group/3",
            "institution-other":              "/aca/group/4",

            "asset-cash-types":               "/type/asset-type/1",
            "asset-property-types":           "/type/asset-type/2",
            "asset-investment-types":         "/type/asset-type/3",
            "asset-superannuation-types":     "/type/asset-type/4",
            "asset-vehicles-types":           "/type/asset-type/5",
            "asset-other-types":              "/type/asset-type/6",

            "liability-creditCard-types":     "/type/liability-type/7",
            "liability-homeLoan-types":       "/type/liability-type/8",
            "liability-investmentLoan-types": "/type/liability-type/9",
            "liability-personalLoan-types":   "/type/liability-type/10",
            "liability-carLoan-types":        "/type/liability-type/11",
            "liability-businessLoan-types":   "/type/liability-type/12",
            "liability-lineOfCredit-types":   "/type/liability-type/13",
            "liability-marginLoan-types":     "/type/liability-type/14",
            "liability-other-types":          "/type/liability-type/15",

            "insurance-home-types":           "/type/insurance-type/16",
            "insurance-motor-types":          "/type/insurance-type/17",
            "insurance-life-types":           "/type/insurance-type/18",
            "insurance-income-types":         "/type/insurance-type/19",
            "insurance-tpd-types":            "/type/insurance-type/20",
            "insurance-trauma-types":         "/type/insurance-type/21",
            "insurance-landlord-types":       "/type/insurance-type/22",
            "insurance-caravan-types":        "/type/insurance-type/23",
            "insurance-marine-types":         "/type/insurance-type/24",

            "repayment-frequency-type":       "/type/liability-repayment-frequency-type",
            "gender-types":                   "/type/GenderType",
            "marital-status-types":           "/type/MaritalStatusType",
            "institution-types":              "/type/aca-category"
        }

        var getData = function (apiEndpoint, url) {
            return $http.get(url, {
                headers: {
                    "Authorization": "Bearer accesstoken"
                }
            })
            .then(function (response) {
                if (response.data.result == "success") {
                    factory.setType(apiEndpoint, response.data.data);
                } else {
                    return null;
                }
            }, function (response) {
                ddOptions[apiEndpoint] = [];
                return $q.reject(response);
            });
        };        

        factory.setType = function (apiEndpoint, data) {
            if (data) {
                ddOptions[apiEndpoint] = [];
                function logArrayElements(element, index, array) {
                    if(element.id) {
                        ddOptions[apiEndpoint].push({ id: element.id, name: element.name });                        
                    } else {
                        ddOptions[apiEndpoint].push({ id: element.m_Item1, name: element.m_Item2 });
                    }
                }
                data.forEach(logArrayElements);
            } else {
                ddOptions[apiEndpoint] = [];
            }
        }

        factory.getType = function (apiEndpoint) {
            var deffered =  $q.defer();

            if (ddOptions[apiEndpoint] == undefined || ddOptions[apiEndpoint].length == 0) {
               getData(apiEndpoint, apiRoot + apiURIs[apiEndpoint]).then(function () {
                    deffered.resolve(ddOptions[apiEndpoint]);
                })
            } else {
                deffered.resolve(ddOptions[apiEndpoint]);
            }

            return deffered.promise;

        }

        return factory;
    }]);
});