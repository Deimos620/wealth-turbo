'use strict';

define(['angular'], function (angular) {

    angular
        .module('modalDirectives', [])
        /* ASSETS */
        .directive('assetCash', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_asset_cash.html"
            };
        })
        .directive('assetShares', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_asset_invShare.html"
            };
        })
        .directive('assetOther', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_asset_other.html"
            };
        })
        .directive('assetProperty', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_asset_property.html"
            };
        })
        .directive('assetSuper', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_asset_super.html"
            };
        })
        .directive('assetVehicle', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_asset_vehicleLuxuryItem.html"
            };
        })
        /* LIABILITIES */
        .directive('liabilityBusinessLoan', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_liability_businessLoan.html"
            };
        })
        .directive('liabilityCarLoan', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_liability_carLoan.html"
            };
        })
        .directive('liabilityCreditCard', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_liability_creditcard.html"
            };
        })
        .directive('liabilityHomeLoan', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_liability_homeLoan.html"
            };
        })
        .directive('liabilityInvestmentHomeLoan', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_liability_investmentHomeLoan.html"
            };
        })
        .directive('liabilityLineOfCredit', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_liability_lineOfCredit.html"
            };
        })
        .directive('liabilityMarginLoan', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_liability_marginLoan.html"
            };
        })
        .directive('liabilityOther', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_liability_other.html"
            };
        })
        .directive('liabilityPersonalLoan', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_liability_personalLoan.html"
            };
        })

        /* INSURANCES */
        .directive('insuranceCaravan', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_insurance_caravan.html"
            };
        })
        .directive('insuranceHomeContents', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_insurance_homeContents.html"
            };
        })
        .directive('insuranceIncomeProtection', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_insurance_incomeProtection.html"
            };
        })
        .directive('insuranceLandlord', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_insurance_landlord.html"
            };
        })
        .directive('insuranceLife', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_insurance_life.html"
            };
        })
        .directive('insuranceMarine', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_insurance_marine.html"
            };
        })
        .directive('insuranceMotor', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_insurance_motor.html"
            };
        })
        .directive('insuranceTpd', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_insurance_tpd.html"
            };
        })
        .directive('insuranceTrauma', function () {
            return {
                restrict: "E",
                templateUrl: "partials/modals/add_insurance_trauma.html"
            };
        })
        ;
});