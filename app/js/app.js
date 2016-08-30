'use strict';

define([
  'angular',
  'angularRoute',
  'ngstorage',
  'controllers',
  'widgets/controllers',
  'widgets/directives',
  'modals/directives',
  'filters',
  'services',
  'directives',
  'angularJSOAuth2',
  'uiRouter',
  'chart',
  'angular-chartjs',
  'angular-moment',
  'ocModal',
  'factories',
  'ng-bs3-datepicker',
  'jquery-easing',
  'welcome-tour',
  'angular-translate',
  'angular-translate-static',
  'angular-validation',
  'config',
  'jquery-joyride'
], function (angular) {

    let wealthhubApp = angular.module('dashBoardApp', [
      'ngRoute',
      'ngStorage',
      'appControllers',
      'widgetsControllers',
      'adminFilters',
      'adminServices',
      'adminDirectives',
      'afOAuth2',
      'ui.router',
      'chart.js',
      'angularMoment',
      'oc.modal',
      'modalDirectives',
      'widgetDirectives',
      'dropdownFactories',
      'ng-bs3-datepicker',
      'ghiscoding.validation',
      'pascalprecht.translate'
    ]);

    wealthhubApp.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$translateProvider', function ($locationProvider, $stateProvider, $urlRouterProvider, $translateProvider) {

        //$locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('dashboard', {
                url: '/',
                templateUrl: 'pages/dashboard.html',
                controller: 'DashboardController',
                allowTour: true, requireToken: false
            })
            .state('sign-in', {
                url: '/sign-in',
                templateUrl: 'pages/sign-in.html',
                controller: 'SignInController',
                allowTour: true, requireToken: false
            })
            .state('sign-up', {
                abstract:true,
                template: '<div ui-view></div>',
                allowTour: true, requireToken: false
            })
                .state('sign-up.init', {
                    url: '/sign-up',
                    templateUrl: 'pages/sign-up.html',
                    controller: 'SignUpController',
                    allowTour: true, requireToken: false
                })
                .state('sign-up.verify-sms', {
                    url: '/sign-up/verify-sms',
                    templateUrl: 'pages/sign-up/verify-sms.html',
                    controller: 'SignUpController',
                    allowTour: true, requireToken: false
                })
                .state('sign-up.accept-terms', {
                    url: '/sign-up/accept-terms',
                    templateUrl: 'pages/sign-up/accept-terms.html',
                    controller: 'SignUpController',
                    allowTour: true, requireToken: false
                })
                .state('sign-up.digital-safe-download', {
                    url: '/sign-up/digital-safe-download',
                    templateUrl: 'pages/sign-up/digital-safe-download.html',
                    controller: 'SignUpController',
                    allowTour: true, requireToken: false
                })
                .state('sign-up.digital-safe-downloaded', {
                    url: '/sign-up/digital-safe-downloaded',
                    templateUrl: 'pages/sign-up/digital-safe-downloaded.html',
                    controller: 'SignUpController',
                    allowTour: true, requireToken: false
                })
                 .state('my-wealth', {
                     url: '/my-wealth',
                     template: '<div ui-view></div>'
                })
                .state('my-wealth.my-net-wealth', {
                    url: '/my-net-wealth',
                    templateUrl: 'pages/my-wealth/my-net-wealth.html',
                    controller: 'MyWealthController',
                    allowTour: true, requireToken: false
                })
                .state('my-wealth.what-i-own', {
                    url: '/what-i-own',
                    templateUrl: 'pages/my-wealth/what-i-own.html',
                    controller: 'MyWealthWhatIOwnController',
                    allowTour: true, requireToken: false
                })
                    .state('my-wealth.what-i-own-cash', {
                        url: '/what-i-own/cash',
                        templateUrl: 'pages/my-wealth/what-i-own/cash.html',
                        controller: 'MyWealthWhatIOwnCashController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-own-property', {
                        url: '/what-i-own/property',
                        templateUrl: 'pages/my-wealth/what-i-own/property.html',
                        controller: 'MyWealthWhatIOwnPropertyController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-own-investmentshares', {
                        url: '/what-i-own/investment-shares',
                        templateUrl: 'pages/my-wealth/what-i-own/investment-shares.html',
                        controller: 'MyWealthWhatIOwnInvestmentSharesController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-own-superannuation', {
                        url: '/what-i-own/superannuation',
                        templateUrl: 'pages/my-wealth/what-i-own/superannuation.html',
                        controller: 'MyWealthWhatIOwnSuperannuationController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-own-vehiclesluxuryitems', {
                        url: '/what-i-own/vehicles-luxury-items',
                        templateUrl: 'pages/my-wealth/what-i-own/vehicles-luxury-items.html',
                        controller: 'MyWealthWhatIOwnVehiclesLuxuryItemsController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-own-otherassets', {
                        url: '/what-i-own/other-assets',
                        templateUrl: 'pages/my-wealth/what-i-own/other-assets.html',
                        controller: 'MyWealthWhatIOwnOtherAssetsController',
                        allowTour: true, requireToken: false
                    })
                .state('my-wealth.what-i-owe', {
                    url: '/what-i-owe',
                    templateUrl: 'pages/my-wealth/what-i-owe.html',
                    controller: 'MyWealthWhatIOweController',
                    allowTour: true, requireToken: false
                })
                    .state('my-wealth.what-i-owe-creditcard', {
                        url: '/what-i-owe/credit-card',
                        templateUrl: 'pages/my-wealth/what-i-owe/credit-card.html',
                        controller: 'MyWealthWhatIOweCreditCardController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-owe-homeloan', {
                        url: '/what-i-owe/home-loan',
                        templateUrl: 'pages/my-wealth/what-i-owe/home-loan.html',
                        controller: 'MyWealthWhatIOweHomeLoanController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-owe-investmentloan', {
                        url: '/what-i-owe/investment-loan',
                        templateUrl: 'pages/my-wealth/what-i-owe/investment-loan.html',
                        controller: 'MyWealthWhatIOweInvestmentLoanController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-owe-personalloan', {
                        url: '/what-i-owe/personal-loan',
                        templateUrl: 'pages/my-wealth/what-i-owe/personal-loan.html',
                        controller: 'MyWealthWhatIOwePersonalLoanController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-owe-carloan', {
                        url: '/what-i-owe/car-loan',
                        templateUrl: 'pages/my-wealth/what-i-owe/car-loan.html',
                        controller: 'MyWealthWhatIOweCarLoanController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-owe-businessloan', {
                        url: '/what-i-owe/business-loan',
                        templateUrl: 'pages/my-wealth/what-i-owe/business-loan.html',
                        controller: 'MyWealthWhatIOweBusinessLoanController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-owe-lineofcredit', {
                        url: '/what-i-owe/line-of-credit',
                        templateUrl: 'pages/my-wealth/what-i-owe/line-of-credit.html',
                        controller: 'MyWealthWhatIOweLineOfCreditController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-owe-marginloan', {
                        url: '/what-i-owe/margin-loan',
                        templateUrl: 'pages/my-wealth/what-i-owe/margin-loan.html',
                        controller: 'MyWealthWhatIOweMarginLoanController',
                        allowTour: true, requireToken: false
                    })
                    .state('my-wealth.what-i-owe-otherliabilities', {
                        url: '/what-i-owe/other-liabilities',
                        templateUrl: 'pages/my-wealth/what-i-owe/other-liabilities.html',
                        controller: 'MyWealthWhatIOweOtherLiabilitiesController',
                        allowTour: true, requireToken: false
                    })
                .state('my-wealth.my-insurance', {
                    url: '/my-insurance',
                    templateUrl: 'pages/my-wealth/my-insurance.html',
                    controller: 'MyWealthMyInsuranceController',
                    allowTour: true, requireToken: false
                })
            .state('my-accounts', {
                url: '/my-accounts',
                templateUrl: 'pages/my-accounts.html',
                controller: 'MyAccountsController',
                allowTour: true, requireToken: false
            })
            .state('help-support', {
                url: '/help-support',
                template: '<div ui-view></div>'
            })
                .state('help-support.contact-us', {
                    url: '/contact-us',
                    templateUrl: 'pages/help-support/contact-us.html',
                    controller: 'GeneralPageController',
                    allowTour: true, requireToken: false
                })
                .state('help-support.faqs', {
                    url: '/faqs',
                    templateUrl: 'pages/help-support/faqs.html',
                    controller: 'GeneralPageController',
                    allowTour: true, requireToken: false
                })
            .state('add', {
                url: '/add',
                template: '<div ui-view></div>'
            })
                .state('add.account', {
                    url: '/account',
                    templateUrl: 'pages/add/account.html',
                    controller: 'AddAccountController',
                    allowTour: true,
                    requireToken:false
                })
            .state('edit', {
                url: '/edit',
                template: '<div ui-view></div>'
            })
                .state('edit.account', {
                    url: '/account',
                    templateUrl: 'pages/edit/account.html',
                    controller: 'EditAccountController',
                    allowTour: true, requireToken: false
                })
                .state('edit.asset', {
                    url: '/asset',
                    templateUrl: 'pages/edit/asset.html',
                    controller: 'EditAssetController',
                    allowTour: true, requireToken: false
                })
                .state('edit.liability', {
                    url: '/liability',
                    templateUrl: 'pages/edit/liability.html',
                    controller: 'EditLiabilityController',
                    allowTour: true, requireToken: false
                })
                .state('edit.insurance', {
                    url: '/insurance',
                    templateUrl: 'pages/edit/insurance.html',
                    controller: 'EditInsuranceController',
                    allowTour: true, requireToken: false
                })
            .state('profile', {
                url: '/profile',
                template: '<div ui-view></div>'
            })
                .state('profile.my-personal-details', {
                    url: '/my-personal-details',
                    templateUrl: 'pages/profile/my-personal-details.html',
                    controller: 'ProfileController',
                    allowTour: true, requireToken: false
                })
                .state('profile.my-login-details', {
                    url: '/my-login-details',
                    templateUrl: 'pages/profile/my-login-details.html',
                    controller: 'ProfileController',
                    allowTour: true, requireToken: false
                })
                .state('profile.my-preferences', {
                    url: '/my-preferences',
                    templateUrl: 'pages/profile/my-preferences.html',
                    controller: 'ProfileController',
                    allowTour: true, requireToken: false
                })
                .state('profile.cancel-wealth-hub', {
                    url: '/cancel-wealth-hub',
                    templateUrl: 'pages/profile/cancel-wealth-hub.html',
                    controller: 'ProfileController',
                    allowTour: true, requireToken: false
                })
            .state('not-supported', {
                url: '/not-supported',
                templateUrl: 'pages/not-supported.html',
                controller: 'GeneralPageController',
                allowTour: true, requireToken: false
            })
            
        $translateProvider.useStaticFilesLoader({
            prefix: './bower_components/angular-validation-ghiscoding/locales/validation/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escapeParameters');
    }])
    .factory('navFactory', function () {
        return {
            'isActiveNav': function ($state, strBindName) {
                if ($state.is(strBindName)) {
                    return true;
                } else if ($state.current.name.indexOf(strBindName) > -1) {
                    return true;
                }
                return false;
            }
        };
    })
    .factory('safeApply', ['$rootScope', function ($rootScope) {
        return function ($scope, fn) {
            var phase = $scope.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn) {
                    $scope.$eval(fn);
                }
            } else {
                if (fn) {
                    $scope.$apply(fn);
                } else {
                    $scope.$apply();
                }
            }
        }
    }]) 
});