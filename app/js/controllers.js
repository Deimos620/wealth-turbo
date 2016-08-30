'use strict';

define(['angular', 'ui-bootstrap'], function (angular) {

    let appControllers = angular.module('appControllers', ['ui.bootstrap']);
    
    /* PAGE CONTROLLERS */
    appControllers.controller('IndexController', ['$scope', '$state', 'dataService', 'moment', ($scope, $state, dataService, moment) => {
        $scope.prefLoaded = false;
        $scope.userPref = {
            'automaticRefresh': false,
            'defaultView2Column': false,
            'defaultReportPeriod': sessionStorage.getItem("defaultReportPeriod") == null ? '3 months' : sessionStorage.getItem("defaultReportPeriod")
        };
        $scope.reportDates = {
            startDate: new moment().format("YYYY-MM-DD"),
            endDate: new moment().format("YYYY-MM-DD")
        };
        var access_token = null;
        var token_expiry = null;
        var tokenFrom = null;
        if (sessionStorage.getItem("token") == null || sessionStorage.getItem("token") == "null") {
            var locationHash = window.location.hash.split("&");
            for (var i = 0; i < locationHash.length; i++) {
                if(locationHash[i].indexOf("access_token") != -1){
                    access_token = locationHash[i].substr(13);
                    tokenFrom = "hash";
                }
            }
        } else {
            access_token = JSON.parse(sessionStorage.getItem("token")).access_token;
            token_expiry = JSON.parse(sessionStorage.getItem("token")).expires_at;
            tokenFrom = "session"
        }
        if ((new Date(token_expiry) < new Date() && tokenFrom == "session") || tokenFrom == null) {
            access_token = null;
            sessionStorage.removeItem("token");
        }
        $scope.getUserPreferences = function () {
            if (access_token != null) {
                dataService.getWithToken('/profile', access_token).then(function (data) {
                    if (data) {
                        $scope.userPref.automaticRefresh = data.automaticRefresh;
                        $scope.userPref.defaultView2Column = data.defaultView2Column;
                        $scope.prefLoaded = true;
                    }
                });
            }
        };
        $scope.setReportPeriod = function (){
            sessionStorage.setItem("defaultReportPeriod", $scope.userPref.defaultReportPeriod);
            location.reload(true);
        }
        $scope.getReportPeriod = function (){
            if ($scope.userPref.defaultReportPeriod == "3 months") {
                $scope.reportDates.startDate = new moment().startOf('month').subtract(3, 'months').format("YYYY-MM-DD");
                $scope.reportDates.endDate = new moment().endOf('month').format("YYYY-MM-DD");
            } else if ($scope.userPref.defaultReportPeriod == "6 months") {
                $scope.reportDates.startDate = new moment().startOf('month').subtract(6, 'months').format("YYYY-MM-DD");
                $scope.reportDates.endDate = new moment().endOf('month').format("YYYY-MM-DD");
            } else if ($scope.userPref.defaultReportPeriod == "12 months") {
                $scope.reportDates.startDate = new moment().startOf('month').subtract(12, 'months').format("YYYY-MM-DD");
                $scope.reportDates.endDate = new moment().endOf('month').format("YYYY-MM-DD");
            } else if ($scope.userPref.defaultReportPeriod == "this year") {
                $scope.reportDates.startDate = new moment().startOf('year').format("YYYY-MM-DD");
                $scope.reportDates.endDate = new moment().endOf('month').format("YYYY-MM-DD");
            } else if ($scope.userPref.defaultReportPeriod == "last year") {
                $scope.reportDates.startDate = new moment().startOf('year').subtract(1, 'years').format("YYYY-MM-DD");
                $scope.reportDates.endDate = new moment().endOf('year').subtract(1, 'years').format("YYYY-MM-DD");
            }
        }
        $scope.showPopover = function (id) {
            jQuery("#" + id).popover("show");
        };
        $scope.getUserPreferences();
        $scope.getReportPeriod();
        $scope.urls = {
            authSite: urls.authorisation,
            rootHost: urls.rootHost,
            siteBase: urls.siteBase,
            endSession: urls.endSession
        }
    }]);
    appControllers.controller('GeneralPageController', ['$scope', $scope => {
    }]);
    appControllers.controller('NavbarController', ['$scope', '$state', '$ocModal', 'AccessToken', 'moment', 'navFactory', ($scope, $state, $ocModal, AccessToken, moment, navFactory) => {
        $scope.$state = $state;
        $scope.isActiveNav = function ($state, strBindName) {
            return navFactory.isActiveNav($state, strBindName);
        }
        $scope.isAuthenticated = function () {
            return AccessToken.token != null;
        }
        $scope.switchView = function (numColumns) {
            if (numColumns == 2) {
                $scope.userPref.defaultView2Column = true;
            } else {
                $scope.userPref.defaultView2Column = false;                
            }
        }
        $scope.openAddModal = function (type) {
            $ocModal.open({
                id: 'add_' + type + '_select',
                url: 'partials/modals/add_' + type + '_select.html',
                controller: 'ModalController_add',
                cls: 'fade-in',
                closeOnEsc: false,
                init: {
                    type: type,
                    start: '',
                    isFollowModal: false,
                    isSelect: true
                }
            })
        }
        $scope.refreshAll = function () {
        }
        $scope.checkEwise = function () {
            if ($.ewise !== undefined) {
                if ($.ewise.checkBrowser() == "not supported") {
                    console.log("Sorry but this browser type is not supported");
                } else {
                    status = $.ewise.checkComponent();
                    console.log("$.ewise.checkComponent(): " + status);
                    if (status == "no component") {
                        $state.go("sign-up.digital-safe-download");
                    } else {
                        if (status == "no safe") {
                            $.ewise.createSafe();
                        }
                        $state.go($state.current.name);
                    }
                }
            } else {
                console.log("$.ewise: Failed to load ewjcliet script");
            }
        }
        if($state.current.requireToken == false){
            if ($state.current.name !== ''){
                $scope.checkEwise();
            }
        } else if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            if($state.current.name){
                $scope.checkEwise();
            } else {
                $state.go('dashboard');
            }
        } else if ($state.current.name !== 'sign-in'){
            $state.go('sign-in');
        }
        /* Welcome Tour */
        if(localStorage.getItem("whWelcomeTour") == null || localStorage.getItem("whWelcomeTour") == "false"){
            setTimeout('$(".tour-bar").slideDown(1000);', 1000);
            if ($(".tour-bar-info:visible").size() < 1) { $(".tour-bar-info[for='tour_start']").show() }
        }
        $scope.tourHide = function () {
            endTour();
        }
        $scope.tourStart = function () {
            startTour();
        }
        $scope.tourEnd = function () {
            endTour();
            localStorage.setItem("whWelcomeTour", true);
        }
        $scope.tourRestart = function () {
            restartTour();
        }
        $scope.tourNextStep = function () {
            nextStep();
        }
        $scope.tourPrevStep = function () {
            prevStep();
        }
    }]);
    appControllers.controller('FooterController', ['$scope', $scope => {
        $scope.year = new Date().getFullYear();
        console.log("Footer Controller Loading...")
    }]);
    appControllers.controller('DashboardController', ['$scope', '$state', 'dataService', 'AccessToken', 'moment', ($scope, $state, dataService, AccessToken, moment) => {
        console.log("Controller Loading...");
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            if (!$scope.prefLoaded) {
                $scope.getUserPreferences();
            }
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '',  //financial id (asset, liability, insurance id)
                'typeId':      '',  //type id (real estate, shares etc)
                'subTypeId':   '',  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                if(data){
                    $scope.data = data;
                    $scope.assetData     = $scope.data.categories[0];
                    $scope.liabilityData = $scope.data.categories[1];
                    $scope.insuranceData = $scope.data.categories[2];
                }
            });
            $scope.divname = {"Cash":"Cash","Investment/Shares":"Investment","Superannuation":"Superannuation","Vehicles & Luxury Items":"Vehicles","Other Assets":"otherasset",
                              "Credit Card":"creditcard","Home Loan":"homeloan","Investment Loan":"investmentloan","Personal Loan":"personalloan","Car Loan":"carloan",
                              "Business Loan":"businessloan","Line Of Credit":"lineofcredit","Margin Loan":"marginloan","Other Liabilities":"otherliablilities",
                              "Home & Contents":"homeandcontents","Total & Permanent Disablement (TPD)":"tpd","Landlord":"landlord","Marine":"marine","Property":"property","Motor":"motor","Life":"life",
                              "Income Protection":"incomeprotection","Trauma":"trauma","Caravan & Trailer":"caravanTrailer"};
            $scope.toggle = function(id){
                var toggle_id = id + "-id";
                var classname = $('#' + toggle_id).attr('class');
                if(classname == 'fa fa-caret-down') {
                    $('#' + toggle_id).removeClass("fa-caret-down");
                    $('#' + toggle_id).addClass("fa-caret-right");
                }
                else if(classname == 'fa fa-caret-right') {
                    $('#' + toggle_id).removeClass("fa-caret-right");
                    $('#' + toggle_id).addClass("fa-caret-down");
                }
            }
        }
    }]);
    appControllers.controller('ProfileController', ['$scope', 'dataService', 'AccessToken', 'moment', 'Types', ($scope, dataService, AccessToken, moment, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            $scope.types = {};
            $scope.profileData = {};
            $scope.loginData = {};
            $scope.profileDOB = null;
            $scope.smsData = {
                'requested': false,
                'token': null,
                'code': null
            };
            dataService.get('/profile').then(function (data) {
                $scope.profileData = data;
                if ($scope.profileData.externalDetails.dob != null) {
                    $scope.profileDOB = moment($scope.profileData.externalDetails.dob).format("DD/MM/YYYY");
                }
            });
            dataService.get('/user').then(function (data) {
                $scope.loginData = data;
            });
            Types.getType('gender-types').then(function (data) { $scope.types.genderTypes = data });
            Types.getType('marital-status-types').then(function (data) { $scope.types.maritalStatusTypes = data });
            
            $scope.updateProfile = function() {
                let dataToSend = JSON.parse(angular.toJson($scope.profileData));
                dataToSend.externalDetails.dob = moment($scope.profileDOB, "DD/MM/YYYY").format("YYYY-MM-DDTHH:mm:ss");

                dataService.put('/profile', JSON.stringify(dataToSend)).then(function (data) {
                    $scope.profileData = data;
                    if ($scope.profileData.externalDetails.dob != null) {
                        $scope.profileDOB = moment($scope.profileData.externalDetails.dob).format("DD/MM/YYYY");
                    }
                });
            };
            
            $scope.requestSMSCode = function () {
                dataService.get('/user/smsrequest').then(function (data) {
                    $scope.smsData.requested = true;
                    $scope.smsData.token = data;
                });
            };
            
            $scope.updateLoginDetails = function () {
                let dataToSend = {
                    'registeredEmailAddress': $scope.loginData.email,
                    'password': $scope.loginData.password,
                    'confirmPassword': $scope.loginData.confirmPassword,
                    'verifyToken': $scope.smsData.token,
                    'verifyCode': $scope.smsData.code
                };
                dataService.put('/user', JSON.stringify(dataToSend)).then(function (data) {
                });
            };
        }
    }]);
    appControllers.controller('SignInController', ['$scope', '$state', 'AccessToken', ($scope, $state, AccessToken) => {
        if (AccessToken.token != null) {
            $state.go('dashboard');
        } else{
            $state.go('sign-in');
        }
    }]);
    appControllers.controller('SignUpController', ['$scope', '$state', 'dataService', ($scope, $state, dataService) => {
        //validateSMS function
        $scope.smsCode = null;
        $scope.validateSMS = function () {
            dataService.post('/profile/valsms', $scope.smsCode).then(function (data) {
                if (data.activationDate != null) {
                    $state.go("sign-up.accept-terms");
                }
            })
        };
        $scope.acceptTerms = function () {
            dataService.post('/profile/accepttc', '').then(function (data) {
                if (data.termsAndConditionsAccepted != null) {
                    $state.go("sign-up.digital-safe-download");
                }
            })
        };
        $scope.dsInstalled = false;
        $scope.dsTerms = false;
        function check(onceOnly) {
            function check(onceOnly) {
                console.log("Checking for eWise Software ... " + new Date().toString());
                let status = $.ewise.checkComponent();
                if (status != "no component") {
                    $scope.dsInstalled = true;
                    $state.go("sign-up.digital-safe-downloaded");
                } else {
                    $scope.dsInstalled = false;
                    if(!onceOnly){
                        setTimeout(function() { check(false); }, 10000);
                    }
                }
            };
        }
        $scope.downloadSafe = function () {
            if ($scope.dsTerms) {
                $.ewise.downloadComponent();
                setTimeout(function() { check(false); }, 10000);
            }
        };
        $scope.afterDownload = function () {
            $state.go("sign-up.digital-safe-downloaded");
        };
        $scope.finishSignUp = function () {
            $state.go("add.account");
        }
        if($.ewise != null) {
            let status = $.ewise.checkComponent();
            if (status != "no component") {
                $scope.dsInstalled = true;
                $scope.finishSignUp();
            }
        }
    }]);
    
    appControllers.controller('MyWealthController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', ($scope, dataService, AccessToken, moment, graphService) => {
        $scope.switchView = function (numColumns) {
            if (numColumns == 2) {
                $scope.userPref.defaultView2Column = true;
            } else {
                $scope.userPref.defaultView2Column = false;                
            }
        }
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(106,77,138,1)"}]; //"#6A4D8A"
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '',                                  //financial id (asset, liability, insurance id)
                'typeId':      '',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.assetData = data.categories[0];
                $scope.liabilityData = data.categories[1];
                $scope.barGraph = graphService.CreateBarGraphNet(data.wealthHistory, barGraphColours);
            });
        }
    }]);
    
    appControllers.controller('MyWealthWhatIOwnController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', ($scope, dataService, AccessToken, moment, graphService) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(27,117,33,1)"}]; //"#1b7521"
            let doughnutGraphColours = {
                "Cash": "#0b6012",
                "Property": "#3e7519",
                "Investment/Shares": "#6e8b1d",
                "Superannuation": "#9da123",
                "Vehicles & Luxury Items": "#cdb729",
                "Other Assets": "#ffce00"
            }
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '1', //financial id (asset, liability, insurance id)
                'typeId':      '', //type id (real estate, shares etc)
                'subTypeId':   '', //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.assetData = data.categories[0];
                $scope.doughnutGraphs = graphService.CreateDoughnutGraphs($scope.data.categories[0].categoryItems, doughnutGraphColours, "my-wealth.what-i-own");
                $scope.barGraph = graphService.CreateBarGraphAsset(data.wealthHistory, barGraphColours);
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOwnCashController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(11,96,18,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '1',                                  //financial id (asset, liability, insurance id)
                'typeId':      '1',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.assetData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphAsset(data.wealthHistory, barGraphColours);
                Types.getType('asset-cash-types').then(function (data) {
                    $scope.doughnutGraphs = graphService.CreateDoughnutGraphsSub($scope.data.categories[0].categoryItems[0], "#0b6012", data);
                });
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOwnPropertyController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(62,117,25,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '1',                                  //financial id (asset, liability, insurance id)
                'typeId':      '2',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.assetData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphAsset(data.wealthHistory, barGraphColours);
                Types.getType('asset-property-types').then(function (data) {
                    $scope.doughnutGraphs = graphService.CreateDoughnutGraphsSub($scope.data.categories[0].categoryItems[0], "#3e7519", data);
                });
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOwnInvestmentSharesController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(110,139,29,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '1',                                  //financial id (asset, liability, insurance id)
                'typeId':      '3',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.assetData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphAsset(data.wealthHistory, barGraphColours);
                Types.getType('asset-investment-types').then(function (data) {
                    $scope.doughnutGraphs = graphService.CreateDoughnutGraphsSub($scope.data.categories[0].categoryItems[0], "#6e8b1d", data);
                });
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOwnSuperannuationController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(157,161,35,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '1',                                  //financial id (asset, liability, insurance id)
                'typeId':      '4',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.assetData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphAsset(data.wealthHistory, barGraphColours);
                Types.getType('asset-superannuation-types').then(function (data) {
                    $scope.doughnutGraphs = graphService.CreateDoughnutGraphsSub($scope.data.categories[0].categoryItems[0], "#9da123", data);
                });
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOwnVehiclesLuxuryItemsController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(205,183,41,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '1',                                  //financial id (asset, liability, insurance id)
                'typeId':      '5',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.assetData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphAsset(data.wealthHistory, barGraphColours);
                Types.getType('asset-vehicles-types').then(function (data) {
                    $scope.doughnutGraphs = graphService.CreateDoughnutGraphsSub($scope.data.categories[0].categoryItems[0], "#cdb729", data);
                });
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOwnOtherAssetsController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(255,206,0,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '1',                                  //financial id (asset, liability, insurance id)
                'typeId':      '6',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.assetData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphAsset(data.wealthHistory, barGraphColours);
                Types.getType('asset-other-types').then(function (data) {
                    $scope.doughnutGraphs = graphService.CreateDoughnutGraphsSub($scope.data.categories[0].categoryItems[0], "#ffce00", data);
                });
            });
        }
    }]);

    appControllers.controller('MyWealthWhatIOweController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', ($scope, dataService, AccessToken, moment, graphService) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(247,76,68,1)"}]; //"#f74c44"
            let doughnutGraphColours = {
                "Credit Card": "#7c133e",
                "Home Loan": "#a0173e",
                "Investment Loan": "#cc211d",
                "Personal Loan": "#fa4a3d",
                "Car Loan": "#fa6667",
                "Business Loan": "#ff83a6",
                "Line Of Credit": "#fda1be",
                "Margin Loan": "#fcc0d6",
                "Other Liabilities": "#ffc1c0"
            }
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '2',                                  //financial id (asset, liability, insurance id)
                'typeId':      '',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.liabilityData = data.categories[0];
                $scope.doughnutGraphs = graphService.CreateDoughnutGraphs($scope.data.categories[0].categoryItems, doughnutGraphColours, "my-wealth.what-i-owe");
                $scope.barGraph = graphService.CreateBarGraphLiability(data.wealthHistory, barGraphColours);
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOweCreditCardController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(124,19,62,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '2',                                  //financial id (asset, liability, insurance id)
                'typeId':      '7',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.liabilityData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphLiability(data.wealthHistory, barGraphColours);
                $scope.doughnutGraphs = graphService.CreateDoughnutGraphsInst($scope.data.categories[0].categoryItems[0], "#7c133e");
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOweHomeLoanController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(160,23,62,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '2',                                  //financial id (asset, liability, insurance id)
                'typeId':      '8',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.liabilityData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphLiability(data.wealthHistory, barGraphColours);
                $scope.doughnutGraphs = graphService.CreateDoughnutGraphsInst($scope.data.categories[0].categoryItems[0], "#a0173e");
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOweInvestmentLoanController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(204,33,29,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '2',                                  //financial id (asset, liability, insurance id)
                'typeId':      '9',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.liabilityData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphLiability(data.wealthHistory, barGraphColours);
                $scope.doughnutGraphs = graphService.CreateDoughnutGraphsInst($scope.data.categories[0].categoryItems[0], "#cc211d");
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOwePersonalLoanController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(250,74,61,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '2',                                  //financial id (asset, liability, insurance id)
                'typeId':      '10',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.liabilityData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphLiability(data.wealthHistory, barGraphColours);
                $scope.doughnutGraphs = graphService.CreateDoughnutGraphsInst($scope.data.categories[0].categoryItems[0], "#fa4a3d");
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOweCarLoanController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(250,102,103,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '2',                                  //financial id (asset, liability, insurance id)
                'typeId':      '11',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.liabilityData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphLiability(data.wealthHistory, barGraphColours);
                $scope.doughnutGraphs = graphService.CreateDoughnutGraphsInst($scope.data.categories[0].categoryItems[0], "#fa6667");
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOweBusinessLoanController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(255,131,166,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '2',                                  //financial id (asset, liability, insurance id)
                'typeId':      '12',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.liabilityData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphLiability(data.wealthHistory, barGraphColours);
                $scope.doughnutGraphs = graphService.CreateDoughnutGraphsInst($scope.data.categories[0].categoryItems[0], "#ff83a6");
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOweLineOfCreditController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(253,161,190,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '2',                                  //financial id (asset, liability, insurance id)
                'typeId':      '13',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.liabilityData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphLiability(data.wealthHistory, barGraphColours);
                $scope.doughnutGraphs = graphService.CreateDoughnutGraphsInst($scope.data.categories[0].categoryItems[0], "#fda1be");
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOweMarginLoanController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(252,192,214,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '2',                                  //financial id (asset, liability, insurance id)
                'typeId':      '14',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.liabilityData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphLiability(data.wealthHistory, barGraphColours);
                $scope.doughnutGraphs = graphService.CreateDoughnutGraphsInst($scope.data.categories[0].categoryItems[0], "#fcc0d6");
            });
        }
    }]);
    appControllers.controller('MyWealthWhatIOweOtherLiabilitiesController', ['$scope', 'dataService', 'AccessToken', 'moment', 'GraphService', 'Types', ($scope, dataService, AccessToken, moment, graphService, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let barGraphColours = [{fillColor: "rgba(255,193,192,1)"}];
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '2',                                  //financial id (asset, liability, insurance id)
                'typeId':      '15',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.liabilityData = data.categories[0];
                $scope.barGraph = graphService.CreateBarGraphLiability(data.wealthHistory, barGraphColours);
                $scope.doughnutGraphs = graphService.CreateDoughnutGraphsInst($scope.data.categories[0].categoryItems[0], "#ffc1c0");
            });
        }
    }]);
    
    appControllers.controller('MyWealthMyInsuranceController', ['$scope', 'dataService', 'AccessToken', 'moment', '$ocModal', ($scope, dataService, AccessToken, moment, $ocModal) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            let apiURL = '/summary?fid=_0_&tid=_1_&stid=_2_&start=_3_&end=_4_';
            let apiParams = {
                'financialId': '3',                                  //financial id (asset, liability, insurance id)
                'typeId':      '',                                  //type id (real estate, shares etc)
                'subTypeId':   '',                                  //sub type (share portfolio, single etc)
                'startDate':   $scope.reportDates.startDate, //start of the reporting period
                'endDate':     $scope.reportDates.endDate //end of the reporting period
            };
            let dataAPI = apiURL.replace("_0_", apiParams.financialId)
                                .replace("_1_", apiParams.typeId)
                                .replace("_2_", apiParams.subTypeId)
                                .replace("_3_", apiParams.startDate)
                                .replace("_4_", apiParams.endDate);
            dataService.get(dataAPI).then(function (data) {
                $scope.data = data;
                $scope.insuranceData = data.categories[0];
            });
            
            $scope.addInsurance = function (formUI) {
                $ocModal.open({
                    id: 'add_' + formUI,
                    url: 'partials/modals/add_' + formUI + '.html',
                    cls: 'fade-in',
                    closeOnEsc: false,
                    controller: 'ModalController_add',
                    init: {
                        type: 'insurance',
                        start: '',
                        isFollowModal: false,
                        isSelect: false
                    }
                });
            }
            
            dataService.get('/asset').then(function (data) {
                $scope.uninsuredAssets = [];
                data.forEach(function(element, index, array){
                    if ((element.categoryType.id == 2 || element.categoryType.id) && element.insurance == null) {
                        $scope.uninsuredAssets.push(element);
                    }
                });
            });
        }
    }]);
    
    appControllers.controller('MyAccountsController', ['$scope', 'dataService', 'AccessToken', 'moment', ($scope, dataService, AccessToken, moment) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            dataService.get('/acc').then(function (data) {
                $scope.data = data
            })
        }
    }]);
    appControllers.controller('AddAccountController', ['$scope', '$state', 'dataService', 'AccessToken', 'moment', 'Types', 'safeApply', ($scope, $state, dataService, AccessToken, moment, Types, safeApply) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            $scope.isLoading = false;
            
            /* Stage: Select */
            $scope.categories = [];
            $scope.selectedCategory = null;
            $scope.searchTerm = "";
            $scope.searchResults = [];
            $scope.selectedInstitutions = [];
            $scope.currentInstitutions = [];
            $scope.findInstitution = function (event) {
                let searchTerm = event.target.value;
                if (searchTerm.length > 2) {
                    dataService.get('/aca/' + searchTerm).then(function (data) {
                        $scope.searchResults = [];
                        data.forEach(function(element, index, array){
                            if(element.financialGroup.id == $scope.selectedCategory){
                                $scope.searchResults.push(element);
                            }
                        })
                    });
                }
            }
            $scope.selectCategory = function (id) {
                $scope.selectedCategory = id;
                dataService.get('/aca/group/' + id).then(function (data) {
                    $scope.searchResults = [];
                    if ($scope.searchTerm != "") {
                        data.forEach(function(element, index, array){
                            if(element.name.toLowerCase().indexOf($scope.searchTerm) != -1){
                                $scope.searchResults.push(element);
                            }
                        })
                    } else {
                        $scope.searchResults = data;                        
                    }
                });
            }
            $scope.selectInstitution = function (index) {
                $scope.selectedInstitutions.push($scope.searchResults[index]);
            }
            $scope.unselectInstitution = function (index) {
                $scope.selectedInstitutions = $scope.selectedInstitutions.splice(index, 1);
            }
            $scope.deleteFormEwise = function(index) {
                console.log($scope.currentInstitutions[index]);
                $.ewise.initialise(function(status) {
                    if(status == "success") {
                        $.ewise.removeInstitutions([$scope.currentInstitutions[index].iid], function() { 
                            console.log(arguments);
                            alert("Institution removed");
                        });
                    }
                });
            }
            let initSelect = function () {
                console.log("initSelect");
                $.ewise.initialise(function(status) {
                    console.log("Add Accounts - initSelect : " + status);
                    if(status == "success") {
                        $.ewise.getUserProfile(function(response) {
                            if (response.status == "success") {
                                $scope.currentInstitutions = response.data.userprofile;
                                safeApply($scope);
                            }
                        });
                    }
                });
            }
            /* Stage: Login */
            let initLogin = function () {
                console.log("initLogin");
                //Run $.ewise.getPrompts for each selectedInstitutions
                angular.forEach($scope.selectedInstitutions, function(value, key) {
                    value.promptData = null;
                    value.loginValid = -1;
                    $.ewise.initialise(function(status) {
                        if(status == "success") {
                            $.ewise.getPrompts(value.ewiseInstitutionId, function(response) {
                                if (response.status == "success") {
                                    value.promptData = response.data;
                                }
                                safeApply($scope);
                            });
                        }
                    });
                });
            };
            $scope.testLogin = function (instData) {
                console.log("Test Login @ Line 354");
            };
            $scope.connectInstitutions = function () {
                console.log("Connect Institutions @ Line 357");
                $scope.isLoading = true;
                
                //angular.forEach($scope.selectedInstitutions, function(a, key) {
                var a = $scope.selectedInstitutions[0];
                var instId = a.promptData.instId;
                var prompts = [];
                angular.forEach(a.promptData.prompts, function(b, key) {
                    var eVal = b.value;
                    if(b.enteredValue){
                        eVal = b.enteredValue;
                    }
                    prompts.push({'index': b.index, 'type': b.type, 'value': eVal});
                });
                var newAccounts = [];
                $.ewise.initialise(function(status) {
                    if(status == "success") {
                        $.ewise.updateAccounts(
                            [instId],
                            function(response) {
                                console.log("===== UPDATE ACCOUNTS =====");
                                console.log("##### RESPONSE #####");
                                console.log(response);
                                console.log("=========== END ===========");

                                if (response.status == 'verify') {
                                    var otp = prompt(response.verify.prompt);
                                    $.ewise.setVerify(response.instId, otp);
                                }
                                    
                                if (response.status == 'data') {
                                    //Collect Data
                                    newAccounts.push({
                                        id: null,
                                        uniqueInstitutionId: response.instId,
                                        accountId: response.data.accountId,
                                        accountName: response.data.accountName,
                                        accountNumber: response.data.accountNumber,
                                        available: parseFloat(response.data.availBalance),
                                        balance: parseFloat(response.data.balance),
                                        accountType: {id: 1, name: null},
                                        category: {id: 1, name: null},
                                        viewPreference: {id: 1, name: null},
                                        institution: {id: 1, name: null},
                                        ewiseInstitution: {id: parseInt(response.instId.substr(5, 4)), name: null},
                                        currencyType: "AUD",//response.data.currency,
                                        monetaryUnit: {id: 1, name: "AUD"},
                                        balanceRefreshed: moment().format()
                                    })
                                }
                                    
                                if (response.status == 'complete') {
                                    //Save Institution Data
                                    dataService.post('/acc', JSON.stringify(newAccounts)).then(function (data) {
                                        console.log("%%%%% SAVE ACCOUNTS");
                                        console.log(data)
                                        console.log("%%%%% END");
                                    });
                                    newAccounts = [];
                                }
                                    
                                if (response.status == 'all complete') {
                                    $scope.isLoading = false;
                                    //Redirect to Confirm Stage
                                    //$scope.goToConfirm();
                                    alert("DONE!");
                                    //Temporary Refresh
                                    location.href = location.protocol + "//" + location.hostname + location.pathname;
                                }
                            },
                            "",
                            {
                                "instId": instId,
                                "prompts": prompts
                            }
                        );
                    }
                });
            };
            /* Stage: Confirm */
            let initConfirm = function () {};
            /* Types & API Calls */
            Types.getType('institution-types').then(function(data){
                $scope.categories = data;
                if (data.length > 0){
                    $scope.selectCategory(data[0].id)
                }
            });
            /* Navigation */
            $scope.stage = ""; //login, confirm
            $scope.goToSelect = function () {
                $scope.stage = "select";
                initSelect();
            }
            $scope.goToLogin = function () {
                $scope.stage = "login";
                initLogin();
            }
            $scope.goToConfirm = function () {
                $scope.connectInstitutions();
                $scope.stage = "confirm";
                initConfirm();
            }
            $scope.goToDashboard = function () {
                $state.go("dashboard");
            }
            $scope.goToSelect();
        }
    }]);
    appControllers.controller('EditAccountController', ['$scope', 'dataService', 'AccessToken', 'moment', 'Types', ($scope, dataService, AccessToken, moment, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            $scope.accountTypes = [];
            dataService.get('/acc').then(function (data) {
                $scope.data = data;
            });
            Types.getType('institution-types').then(function(data){ $scope.accountTypes = data; });
            $scope.updateAccount = function() {
                //dataService.put('/acp/{id}').then(function (data) {
                //    $scope.data = data;
                //})
            };
            $scope.removeInstitution = function (item) {
                console.log("Remove Institution: @ Line: 359");
                var instId = item.uniqueInstitutionId
                $.ewise.removeInstitution([instId], function(response) {
                    if (response.status == "success") {
                        var dataInstList = response.data.instList;
                        console.log(dataInstList);
                        //dataService.delete('api/inst/{id}').then(function (data) {
                        //    console.log(data);
                        //});
                    }
                });
            };
        }
    }]);
    appControllers.controller('EditAssetController', ['$scope', '$state', '$ocModal', 'dataService', 'AccessToken', 'moment', 'Types', ($scope, $state, $ocModal, dataService, AccessToken, moment, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            $scope.noLinkedAccount = true;
            $scope.noLinkedAsset = true;
            $scope.noLinkedLiability = true;
            $scope.noLinkedInsurance = true;
            $scope.checkForFollowUpModals = function () {
                let ss_FollowUpModals = sessionStorage.getItem("FollowUpModals");
                let followUpModals = (ss_FollowUpModals == "" || ss_FollowUpModals == null) ? [] : ss_FollowUpModals.split(";");

                if ($scope.addAsset.cash) { followUpModals.push("asset_cash"); }
                if ($scope.addAsset.invShare) { followUpModals.push("asset_invShare"); }
                if ($scope.addAsset.other) { followUpModals.push("asset_other"); }
                if ($scope.addAsset.property) { followUpModals.push("asset_property"); }
                if ($scope.addAsset.supe) { followUpModals.push("asset_super"); }
                if ($scope.addAsset.vehicleLuxuryItem) { followUpModals.push("asset_vehicleLuxuryItem"); }

                if ($scope.addLiability.businessLoan) { followUpModals.push("liability_businessLoan"); }
                if ($scope.addLiability.carLoan) { followUpModals.push("liability_carLoan"); }
                if ($scope.addLiability.creditCard) { followUpModals.push("liability_creditCard"); }
                if ($scope.addLiability.homeLoan) { followUpModals.push("liability_homeLoan"); }
                if ($scope.addLiability.investmentHomeLoan) { followUpModals.push("liability_investmentHomeLoan"); }
                if ($scope.addLiability.lineOfCredit) { followUpModals.push("liability_lineOfCredit"); }
                if ($scope.addLiability.marginLoan) { followUpModals.push("liability_marginLoan"); }
                if ($scope.addLiability.other) { followUpModals.push("liability_other"); }
                if ($scope.addLiability.personalLoan) { followUpModals.push("liability_personalLoan"); }

                if ($scope.addInsurance.caravan) { followUpModals.push("insurance_caravan"); }
                if ($scope.addInsurance.homeContents) { followUpModals.push("insurance_homeContents"); }
                if ($scope.addInsurance.incomeProtection) { followUpModals.push("insurance_incomeProtection"); }
                if ($scope.addInsurance.landlord) { followUpModals.push("insurance_landlord"); }
                if ($scope.addInsurance.life) { followUpModals.push("insurance_life"); }
                if ($scope.addInsurance.marine) { followUpModals.push("insurance_marine"); }
                if ($scope.addInsurance.motor) { followUpModals.push("insurance_motor"); }
                if ($scope.addInsurance.tpd) { followUpModals.push("insurance_tpd"); }
                if ($scope.addInsurance.trauma) { followUpModals.push("insurance_trauma"); }

                if (followUpModals.length > 0) {
                    sessionStorage.setItem("FollowUpModals", followUpModals.join(";"));
                } else {
                    sessionStorage.setItem("FollowUpModals", "");
                }
            }
            $scope.resetAddObjects = function () {
                $scope.addAsset = { cash: false, invShare: false, other: false, property: false, super: false, vehicleLuxuryItem: false }
                $scope.addInsurance = { caravan: false, homeContents: false, incomeProtection: false, landlord: false, life: false, marine: false, motor: false, tpd: false, trauma: false }
                $scope.addLiability = { businessLoan: false, carLoan: false, creditCard: false, homeLoan: false, investmentHomeLoan: false, lineOfCredit: false, marginLoan: false, other: false, personalLoan: false }
            };
            $scope.typeID = '';
            $scope.assetItem = '';
            $scope.currentIndex = 0;
            $scope.types = {}
            $scope.liabilities = [];
            $scope.accounts = [];
            $scope.openItem = function (index, categoryTypeID) {
                $scope.typeID = categoryTypeID;
                $scope.assetItem = $scope.items[index]
                $scope.currentIndex = index;
                if($scope.assetItem.cash != null && $scope.assetItem.cash.termDeposit != null){
                    if ($scope.assetItem.cash.termDeposit.maturity.length > 10) {
                        $scope.assetItem.cash.termDeposit.maturity = moment($scope.assetItem.cash.termDeposit.maturity, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY");
                    }
                }
            }
            $scope.updateItem = function () {
                var dataToSend = JSON.parse(angular.toJson($scope.assetItem));
                if(dataToSend.realEstate != null){
                    dataToSend.description = dataToSend.realEstate.address.addressText;
                }
                if(dataToSend.cash != null && dataToSend.cash.termDeposit != null){
                    dataToSend.cash.termDeposit.maturity = moment(dataToSend.cash.termDeposit.maturity, "DD/MM/YYYY").format("YYYY-MM-DDTHH:mm:ss");
                }
                $scope.checkForFollowUpModals();
                dataService.post('/asset', JSON.stringify(dataToSend)).then(function (data) {
                    let ss_FollowUpModals = sessionStorage.getItem("FollowUpModals");
                    let followUpModals = (ss_FollowUpModals == "" || ss_FollowUpModals == null) ? [] : ss_FollowUpModals.split(";");
                    if (followUpModals.length > 0) {
                        let goToModal = followUpModals.shift();
                        sessionStorage.setItem("FollowUpModals", followUpModals.join(";"));
                        $ocModal.open({
                            id: 'add_' + goToModal,
                            url: 'partials/modals/add_' + goToModal + '.html',
                            cls: 'fade-in',
                            closeOnEsc: false,
                            controller: 'ModalController_add',
                            init: {
                                type: $scope.startType,
                                start: $scope.startItem,
                                isFollowModal: true,
                                isSelect: false
                            }
                        });
                    } else {
                        $state.reload();
                    }
                });
            }
            $scope.removeItem = function () {
                dataService.delete('/asset/' + $scope.assetItem.id).then(function (data) {
                    $state.reload();
                });
            }
            $scope.resetAddObjects();
            dataService.get('/asset').then(function (data) {
                $scope.items = data;
                $scope.openItem(0, data[0].categoryType.id);
                Types.getType('institution-bank').then(function (data) { $scope.types.financialInstitutions = data });
                Types.getType('asset-cash-types').then(function (data) { $scope.types.cashTypes = data });
                Types.getType('asset-investment-types').then(function (data) { $scope.types.investmentTypes = data });
                Types.getType('asset-property-types').then(function (data) { $scope.types.propertyTypes = data });
                Types.getType('asset-vehicles-types').then(function (data) { $scope.types.luxuryItemTypes = data });
                Types.getType('asset-other-types').then(function (data) { $scope.types.otherAssetTypes = data });
                Types.getType('repayment-frequency-type').then(function (data) { $scope.types.repaymentFrequencies = data });
                Types.getType('liability-carLoan-types').then(function (data) { $scope.types.carLoanTypes = data });
                Types.getType('insurance-motor-types').then(function (data) { $scope.types.motorInsuranceTypes = data });
                dataService.get('/liab').then(function (data) { $scope.liabilities = data });
                dataService.get('/acc').then(function (data) { $scope.accounts = data });
            })
        }
    }]);
    appControllers.controller('EditLiabilityController', ['$scope', '$state', '$ocModal', 'dataService', 'AccessToken', 'moment', 'Types', ($scope, $state, $ocModal, dataService, AccessToken, moment, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            $scope.noLinkedAsset = true;
            $scope.noLinkedLiability = true;
            $scope.noLinkedInsurance = true;
            $scope.checkForFollowUpModals = function () {
                let ss_FollowUpModals = sessionStorage.getItem("FollowUpModals");
                let followUpModals = (ss_FollowUpModals == "" || ss_FollowUpModals == null) ? [] : ss_FollowUpModals.split(";");

                if ($scope.addAsset.cash) { followUpModals.push("asset_cash"); }
                if ($scope.addAsset.invShare) { followUpModals.push("asset_invShare"); }
                if ($scope.addAsset.other) { followUpModals.push("asset_other"); }
                if ($scope.addAsset.property) { followUpModals.push("asset_property"); }
                if ($scope.addAsset.supe) { followUpModals.push("asset_super"); }
                if ($scope.addAsset.vehicleLuxuryItem) { followUpModals.push("asset_vehicleLuxuryItem"); }

                if ($scope.addLiability.businessLoan) { followUpModals.push("liability_businessLoan"); }
                if ($scope.addLiability.carLoan) { followUpModals.push("liability_carLoan"); }
                if ($scope.addLiability.creditCard) { followUpModals.push("liability_creditCard"); }
                if ($scope.addLiability.homeLoan) { followUpModals.push("liability_homeLoan"); }
                if ($scope.addLiability.investmentHomeLoan) { followUpModals.push("liability_investmentHomeLoan"); }
                if ($scope.addLiability.lineOfCredit) { followUpModals.push("liability_lineOfCredit"); }
                if ($scope.addLiability.marginLoan) { followUpModals.push("liability_marginLoan"); }
                if ($scope.addLiability.other) { followUpModals.push("liability_other"); }
                if ($scope.addLiability.personalLoan) { followUpModals.push("liability_personalLoan"); }

                if ($scope.addInsurance.caravan) { followUpModals.push("insurance_caravan"); }
                if ($scope.addInsurance.homeContents) { followUpModals.push("insurance_homeContents"); }
                if ($scope.addInsurance.incomeProtection) { followUpModals.push("insurance_incomeProtection"); }
                if ($scope.addInsurance.landlord) { followUpModals.push("insurance_landlord"); }
                if ($scope.addInsurance.life) { followUpModals.push("insurance_life"); }
                if ($scope.addInsurance.marine) { followUpModals.push("insurance_marine"); }
                if ($scope.addInsurance.motor) { followUpModals.push("insurance_motor"); }
                if ($scope.addInsurance.tpd) { followUpModals.push("insurance_tpd"); }
                if ($scope.addInsurance.trauma) { followUpModals.push("insurance_trauma"); }

                if (followUpModals.length > 0) {
                    sessionStorage.setItem("FollowUpModals", followUpModals.join(";"));
                } else {
                    sessionStorage.setItem("FollowUpModals", "");
                }
            }
            $scope.resetAddObjects = function () {
                $scope.addAsset = { cash: false, invShare: false, other: false, property: false, super: false, vehicleLuxuryItem: false }
                $scope.addInsurance = { caravan: false, homeContents: false, incomeProtection: false, landlord: false, life: false, marine: false, motor: false, tpd: false, trauma: false }
                $scope.addLiability = { businessLoan: false, carLoan: false, creditCard: false, homeLoan: false, investmentHomeLoan: false, lineOfCredit: false, marginLoan: false, other: false, personalLoan: false }
            };
            $scope.typeID = '';
            $scope.liabilityItem = '';
            $scope.currentIndex = 0;
            $scope.types = {}
            $scope.openItem = function (index, categoryTypeID) {
                $scope.typeID = categoryTypeID;
                $scope.liabilityItem = $scope.items[index]
                $scope.currentIndex = index;
            }
            $scope.updateItem = function () {
                var dataToSend = JSON.parse(angular.toJson($scope.liabilityItem));
                dataToSend.businessLoan = name == "businessLoan" ? {} : null;
                dataToSend.lineOfCredit = name == "lineOfCredit" ? {} : null;
                dataToSend.marginLoan = name == "marginLoan" ? {} : null;
                dataToSend.other = name == "other" ? {} : null;
                dataToSend.personalLoan = name == "personalLoan" ? {} : null;
                $scope.checkForFollowUpModals();
                dataService.post('/liab', JSON.stringify(dataToSend)).then(function (data) {
                    let ss_FollowUpModals = sessionStorage.getItem("FollowUpModals");
                    let followUpModals = (ss_FollowUpModals == "" || ss_FollowUpModals == null) ? [] : ss_FollowUpModals.split(";");
                    if (followUpModals.length > 0) {
                        let goToModal = followUpModals.shift();
                        sessionStorage.setItem("FollowUpModals", followUpModals.join(";"));
                        $ocModal.open({
                            id: 'add_' + goToModal,
                            url: 'partials/modals/add_' + goToModal + '.html',
                            cls: 'fade-in',
                            closeOnEsc: false,
                            controller: 'ModalController_add',
                            init: {
                                type: $scope.startType,
                                start: $scope.startItem,
                                isFollowModal: true,
                                isSelect: false
                            }
                        });
                    } else {
                        $state.reload();
                    }
                });
            }
            $scope.removeItem = function () {
                dataService.delete('/liab/' + $scope.liabilityItem.id).then(function (data) {
                    $state.reload();
                });
            }
            $scope.resetAddObjects();
            dataService.get('/liab').then(function (data) {
                $scope.items = data;
                $scope.openItem(0, data[0].categoryType.id);
                Types.getType('institution-bank').then(function (data) { $scope.types.financialInstitutions = data });
                Types.getType('asset-cash-types').then(function (data) { $scope.types.cashTypes = data });
                Types.getType('asset-investment-types').then(function (data) { $scope.types.investmentTypes = data });
                Types.getType('asset-property-types').then(function (data) { $scope.types.propertyTypes = data });
                Types.getType('asset-vehicles-types').then(function (data) { $scope.types.luxuryItemTypes = data });
                Types.getType('asset-other-types').then(function (data) { $scope.types.otherAssetTypes = data });
                Types.getType('repayment-frequency-type').then(function (data) { $scope.types.repaymentFrequencies = data });
                Types.getType('liability-carLoan-types').then(function (data) { $scope.types.carLoanTypes = data });
                Types.getType('insurance-motor-types').then(function (data) { $scope.types.motorInsuranceTypes = data });
                dataService.get('/asset').then(function (data) { $scope.assets = data });
            });
        }
    }]);
    appControllers.controller('EditInsuranceController', ['$scope', '$state', '$ocModal', 'dataService', 'AccessToken', 'moment', 'Types', ($scope, $state, $ocModal, dataService, AccessToken, moment, Types) => {
        if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
            $scope.noLinkedAsset = true;
            $scope.noLinkedLiability = true;
            $scope.noLinkedInsurance = true;
            $scope.checkForFollowUpModals = function () {
                let ss_FollowUpModals = sessionStorage.getItem("FollowUpModals");
                let followUpModals = (ss_FollowUpModals == "" || ss_FollowUpModals == null) ? [] : ss_FollowUpModals.split(";");

                if ($scope.addAsset.cash) { followUpModals.push("asset_cash"); }
                if ($scope.addAsset.invShare) { followUpModals.push("asset_invShare"); }
                if ($scope.addAsset.other) { followUpModals.push("asset_other"); }
                if ($scope.addAsset.property) { followUpModals.push("asset_property"); }
                if ($scope.addAsset.supe) { followUpModals.push("asset_super"); }
                if ($scope.addAsset.vehicleLuxuryItem) { followUpModals.push("asset_vehicleLuxuryItem"); }

                if ($scope.addLiability.businessLoan) { followUpModals.push("liability_businessLoan"); }
                if ($scope.addLiability.carLoan) { followUpModals.push("liability_carLoan"); }
                if ($scope.addLiability.creditCard) { followUpModals.push("liability_creditCard"); }
                if ($scope.addLiability.homeLoan) { followUpModals.push("liability_homeLoan"); }
                if ($scope.addLiability.investmentHomeLoan) { followUpModals.push("liability_investmentHomeLoan"); }
                if ($scope.addLiability.lineOfCredit) { followUpModals.push("liability_lineOfCredit"); }
                if ($scope.addLiability.marginLoan) { followUpModals.push("liability_marginLoan"); }
                if ($scope.addLiability.other) { followUpModals.push("liability_other"); }
                if ($scope.addLiability.personalLoan) { followUpModals.push("liability_personalLoan"); }

                if ($scope.addInsurance.caravan) { followUpModals.push("insurance_caravan"); }
                if ($scope.addInsurance.homeContents) { followUpModals.push("insurance_homeContents"); }
                if ($scope.addInsurance.incomeProtection) { followUpModals.push("insurance_incomeProtection"); }
                if ($scope.addInsurance.landlord) { followUpModals.push("insurance_landlord"); }
                if ($scope.addInsurance.life) { followUpModals.push("insurance_life"); }
                if ($scope.addInsurance.marine) { followUpModals.push("insurance_marine"); }
                if ($scope.addInsurance.motor) { followUpModals.push("insurance_motor"); }
                if ($scope.addInsurance.tpd) { followUpModals.push("insurance_tpd"); }
                if ($scope.addInsurance.trauma) { followUpModals.push("insurance_trauma"); }

                if (followUpModals.length > 0) {
                    sessionStorage.setItem("FollowUpModals", followUpModals.join(";"));
                } else {
                    sessionStorage.setItem("FollowUpModals", "");
                }
            }
            $scope.resetAddObjects = function () {
                $scope.addAsset = { cash: false, invShare: false, other: false, property: false, super: false, vehicleLuxuryItem: false }
                $scope.addInsurance = { caravan: false, homeContents: false, incomeProtection: false, landlord: false, life: false, marine: false, motor: false, tpd: false, trauma: false }
                $scope.addLiability = { businessLoan: false, carLoan: false, creditCard: false, homeLoan: false, investmentHomeLoan: false, lineOfCredit: false, marginLoan: false, other: false, personalLoan: false }
            };
            $scope.typeID = '';
            $scope.insuranceItem = '';
            $scope.currentIndex = 0;
            $scope.types = {}
            $scope.openItem = function (index, categoryTypeID) {
                $scope.typeID = categoryTypeID;
                $scope.insuranceItem = $scope.items[index]
                $scope.currentIndex = index;
                if ($scope.insuranceItem.policyExpiry.length > 10) {
                    $scope.insuranceItem.policyExpiry = moment($scope.insuranceItem.policyExpiry, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY");
                }
            }
            $scope.updateItem = function () {
                var dataToSend = JSON.parse(angular.toJson($scope.insuranceItem));
                dataToSend.policyExpiry = moment(dataToSend.policyExpiry, "DD/MM/YYYY").format("YYYY-MM-DDTHH:mm:ss");
                $scope.checkForFollowUpModals();
                dataService.post('/insure', JSON.stringify(dataToSend)).then(function (data) {
                    let ss_FollowUpModals = sessionStorage.getItem("FollowUpModals");
                    let followUpModals = (ss_FollowUpModals == "" || ss_FollowUpModals == null) ? [] : ss_FollowUpModals.split(";");
                    if (followUpModals.length > 0) {
                        let goToModal = followUpModals.shift();
                        sessionStorage.setItem("FollowUpModals", followUpModals.join(";"));
                        $ocModal.open({
                            id: 'add_' + goToModal,
                            url: 'partials/modals/add_' + goToModal + '.html',
                            cls: 'fade-in',
                            closeOnEsc: false,
                            controller: 'ModalController_add',
                            init: {
                                type: $scope.startType,
                                start: $scope.startItem,
                                isFollowModal: true,
                                isSelect: false
                            }
                        });
                    } else {
                        $state.reload();
                    }
                });
            }
            $scope.removeItem = function () {
                dataService.delete('/insure/' + $scope.insuranceItem.id).then(function (data) {
                    $state.reload();
                });
            }
            $scope.resetAddObjects();
            dataService.get('/insure').then(function (data) {
                $scope.items = data;
                $scope.openItem(0, data[0].categoryType.id);
                Types.getType('institution-bank').then(function (data) { $scope.types.financialInstitutions = data });
                Types.getType('asset-cash-types').then(function (data) { $scope.types.cashTypes = data });
                Types.getType('asset-investment-types').then(function (data) { $scope.types.investmentTypes = data });
                Types.getType('asset-property-types').then(function (data) { $scope.types.propertyTypes = data });
                Types.getType('asset-vehicles-types').then(function (data) { $scope.types.luxuryItemTypes = data });
                Types.getType('asset-other-types').then(function (data) { $scope.types.otherAssetTypes = data });
                Types.getType('repayment-frequency-type').then(function (data) { $scope.types.repaymentFrequencies = data });
                Types.getType('liability-carLoan-types').then(function (data) { $scope.types.carLoanTypes = data });
                Types.getType('insurance-motor-types').then(function (data) { $scope.types.motorInsuranceTypes = data });
                dataService.get('/asset').then(function (data) { $scope.assets = data });
            });
        }
    }]);

    /* MODAL CONTROLLERS */
    appControllers.controller('ModalController_add', ['$scope', '$state', '$ocModal', '$init', '$timeout', 'dataService', 'AccessToken', 'moment', 'Types', 'validationService', ($scope, $state, $ocModal, $init, $timeout, dataService, AccessToken, moment, Types, ValidationService) => {
        //if(AccessToken.token != null && moment().isBefore(moment(AccessToken.token.expires_at))){
          if(1){
            let vs = new ValidationService({ displayOnlyLastErrorMsg: true });
            $scope.types = {}
            $scope.assets = null;
            $scope.displayOthers = false;
            $scope.noLinkedAsset = null;
            $scope.noLinkedLiability = null;
            $scope.noLinkedInsurance = null;

            $scope.filterlist = { "assetProperty":[8,9],"assetInvestmentShares":9,"assetSuperAnnuation":1,"assetVehicleLuxuryItems":[10,11],"liabilityHomeloan":2,
                                  "liabilityInvestmentHomeloan":2,"insuranceHomeContent":2,"insuranceLandlordsInsurance":2,"insuranceMotorInsurance":5,
                                  "insuranceCaravanInsurance":5 , "insuranceMarineInsurance":5};
            $scope.types = {"repaymentFrequencies":[{"id":1,"name":"Weekly"},{"id":2,"name":"Fortnightly"},{"id":3,"name":"Monthly"},{"id":4,"name":"Quarterly"},{"id":5,           "name":"Annually"}]};
            $scope.startItem = $init.start;
            $scope.startType = $init.type;
            $scope.isFollowModal = $init.isFollowModal;
            $scope.isSelect = $init.isSelect;
            $scope.isAdd = true;
            var modalType = $init.modal;
            if ($scope.isSelect && $init.start != "") {
                $scope.displayOthers = true;
                $scope.startItem = '';
                $scope.completedItem = $init.start;
                setTimeout(function(){ $scope.completedItem = ""; jQuery(".selected-item:visible").fadeOut("slow"); }, 5000);
            }

            $scope.assetItem = {
                "id": null,
                "description": null,
                "insurance": {
                "id": null,
                "name": null
                            },
                "cash": null,
                "shares": null,
                "other": null,
                "realEstate": null,
                "super": null,
                "luxuryItem": null,
                "liabilities": null,
                "accounts": null,
                "deferAdd": null
            };
            $scope.insuranceItem = {
                "id": null,
                "categoryType": null,
                "asset": null,
                "description": null,
                "insurer": null,
                "premium": null,
                "coverAmount": null,
                "premiumFrequency": null,
                "policyExpiry": null,
                "homeAndContents": null,
                "landlord": null,
                "motor": null,
                "marine": null,
                "caravanTrailer": null,
                "life": null,
                "trauma": null,
                "totalPermanentDisablement": null,
                "incomeProtection": null
            };
            $scope.liabilityItem = {
                "id": null,
                "description": null,
                "balance": null,
                "financialInstitution": {
                "id": null,
                "name": null
                        },
                "insurance": null,
                "homeLoan": null,
                "businessLoan": null,
                "carLoan": null,
                "creditCard": null,
                "investmentHomeLoan": null,
                "lineOfCredit": null,
                "marginLoan": null,
                "other": null,
                "personalLoan": null,
                "assets": null,
                "accounts": null
            };
            if(modalType == "liability_homeLoan")
            {
                $scope.liabilityItem.homeLoan = {"repaymentFrequency":$scope.types.repaymentFrequencies[2]};
            }
            if(modalType == "liability_investmentHomeLoan")
            {
                $scope.liabilityItem.investmentHomeLoan = {"repaymentFrequency":$scope.types.repaymentFrequencies[2]};
            }
            if(modalType == "liability_carLoan")
            {
                $scope.liabilityItem.carLoan = {"repaymentFrequency":$scope.types.repaymentFrequencies[2]};
            }
            if(modalType == "insurance_homeContents" || modalType == "insurance_landlord" || modalType == "insurance_tpd" || modalType == "insurance_incomeProtection" ||                             modalType == "insurance_life" || modalType == "insurance_trauma" || modalType == "insurance_motor" || modalType == "insurance_caravan" || modalType == "insurance_marine")
            {
                $scope.insuranceItem.premiumFrequency = $scope.types.repaymentFrequencies[2];
            }
            $scope.openFormModal = function (name) {
                if ($scope.startItem == '') { $scope.startItem = name; }
                $ocModal.close();
                $ocModal.open({
                    id: 'add_' + name,
                    url: 'partials/modals/add_' + name + '.html',
                    cls: 'fade-in',
                    closeOnEsc: false,
                    controller: 'ModalController_add',
                    init: {
                        type: $scope.startType,
                        start: $scope.startItem,
                        isFollowModal: false,
                        isSelect: false,
                        modal:name
                    }
                });
            };
            
            $scope.checkForFollowUpModals = function () {
                let ss_FollowUpModals = sessionStorage.getItem("FollowUpModals");
                let followUpModals = (ss_FollowUpModals == "" || ss_FollowUpModals == null) ? [] : ss_FollowUpModals.split(";");

                if ($scope.addAsset.cash) { followUpModals.push("asset_cash"); }
                if ($scope.addAsset.invShare) { followUpModals.push("asset_invShare"); }
                if ($scope.addAsset.other) { followUpModals.push("asset_other"); }
                if ($scope.addAsset.property) { followUpModals.push("asset_property"); }
                if ($scope.addAsset.supe) { followUpModals.push("asset_super"); }
                if ($scope.addAsset.vehicleLuxuryItem) { followUpModals.push("asset_vehicleLuxuryItem"); }

                if ($scope.addLiability.businessLoan) { followUpModals.push("liability_businessLoan"); }
                if ($scope.addLiability.carLoan) { followUpModals.push("liability_carLoan"); }
                if ($scope.addLiability.creditCard) { followUpModals.push("liability_creditCard"); }
                if ($scope.addLiability.homeLoan) { followUpModals.push("liability_homeLoan"); }
                if ($scope.addLiability.investmentHomeLoan) { followUpModals.push("liability_investmentHomeLoan"); }
                if ($scope.addLiability.lineOfCredit) { followUpModals.push("liability_lineOfCredit"); }
                if ($scope.addLiability.marginLoan) { followUpModals.push("liability_marginLoan"); }
                if ($scope.addLiability.other) { followUpModals.push("liability_other"); }
                if ($scope.addLiability.personalLoan) { followUpModals.push("liability_personalLoan"); }

                if ($scope.addInsurance.caravan) { followUpModals.push("insurance_caravan"); }
                if ($scope.addInsurance.homeContents) { followUpModals.push("insurance_homeContents"); }
                if ($scope.addInsurance.incomeProtection) { followUpModals.push("insurance_incomeProtection"); }
                if ($scope.addInsurance.landlord) { followUpModals.push("insurance_landlord"); }
                if ($scope.addInsurance.life) { followUpModals.push("insurance_life"); }
                if ($scope.addInsurance.marine) { followUpModals.push("insurance_marine"); }
                if ($scope.addInsurance.motor) { followUpModals.push("insurance_motor"); }
                if ($scope.addInsurance.tpd) { followUpModals.push("insurance_tpd"); }
                if ($scope.addInsurance.trauma) { followUpModals.push("insurance_trauma"); }

                if (followUpModals.length > 0) {
                    sessionStorage.setItem("FollowUpModals", followUpModals.join(";"));
                } else {
                    sessionStorage.setItem("FollowUpModals", "");
                }
            }
            /*$scope.resetAddObjects = function () {
                $scope.addAsset = { cash: false, invShare: false, other: false, property: false, super: false, vehicleLuxuryItem: false }
                $scope.addInsurance = { caravan: false, homeContents: false, incomeProtection: false, landlord: false, life: false, marine: false, motor: false, tpd: false, trauma: false }
                $scope.addLiability = { businessLoan: false, carLoan: false, creditCard: false, homeLoan: false, investmentHomeLoan: false, lineOfCredit: false, marginLoan: false, other: false, personalLoan: false }
            };*/
            $scope.resetAddObjects = function () {
                $scope.addAsset = {};
                $scope.addInsurance = {};
                $scope.addLiability = {};
            };

            $scope.saveAsset = function (name) {
                if (vs.checkFormValidity($scope)) {
                    var dataToSend = JSON.parse(angular.toJson($scope.assetItem));
                    if(dataToSend.realEstate != null){
                        dataToSend.description = dataToSend.realEstate.address.addressText;
                    }
                    if(dataToSend.cash != null && dataToSend.cash.termDeposit != null){
                        dataToSend.cash.termDeposit.maturity = moment(dataToSend.cash.termDeposit.maturity, "DD/MM/YYYY").format("YYYY-MM-DDTHH:mm:ss");
                    }
                    $scope.checkForFollowUpModals();
                    dataService.post('/asset', JSON.stringify(dataToSend)).then(function (data) {
                        let ss_FollowUpModals = sessionStorage.getItem("FollowUpModals");
                        let followUpModals = (ss_FollowUpModals == "" || ss_FollowUpModals == null) ? [] : ss_FollowUpModals.split(";");
                        if (followUpModals.length > 0) {
                            let goToModal = followUpModals.shift();
                            sessionStorage.setItem("FollowUpModals", followUpModals.join(";"));
                            $ocModal.close();
                            $ocModal.open({
                                id: 'add_' + goToModal,
                                url: 'partials/modals/add_' + goToModal + '.html',
                                cls: 'fade-in',
                                closeOnEsc: false,
                                controller: 'ModalController_add',
                                init: {
                                    type: $scope.startType,
                                    start: $scope.startItem,
                                    isFollowModal: true,
                                    isSelect: false
                                }
                            });
                        } else {
                            $state.reload();
                            $ocModal.close();
                            if ($scope.startType != ""){
                                $ocModal.open({
                                    id: 'add_' + $scope.startType + '_select',
                                    url: 'partials/modals/add_' + $scope.startType + '_select.html',
                                    controller: 'ModalController_add',
                                    closeOnEsc: false,
                                    cls: 'fade-in',
                                    init: {
                                        type: $scope.startType,
                                        start: $scope.startItem,
                                        isFollowModal: false,
                                        isSelect: true
                                    }
                                });
                            }
                        }
                    });
                }
            };
            $scope.saveLiability = function (name) {
                if (vs.checkFormValidity($scope)) {
                    var dataToSend = JSON.parse(angular.toJson($scope.liabilityItem));
                    dataToSend.businessLoan = name == "businessLoan" ? {} : null;
                    dataToSend.lineOfCredit = name == "lineOfCredit" ? {} : null;
                    dataToSend.marginLoan = name == "marginLoan" ? {} : null;
                    dataToSend.other = name == "other" ? {} : null;
                    dataToSend.personalLoan = name == "personalLoan" ? {} : null;
                    $scope.checkForFollowUpModals();
                    dataService.post('/liab', JSON.stringify(dataToSend)).then(function (data) {
                        let ss_FollowUpModals = sessionStorage.getItem("FollowUpModals");
                        let followUpModals = (ss_FollowUpModals == "" || ss_FollowUpModals == null) ? [] : ss_FollowUpModals.split(";");
                        if (followUpModals.length > 0) {
                            let goToModal = followUpModals.shift();
                            sessionStorage.setItem("FollowUpModals", followUpModals.join(";"));
                            $ocModal.close();
                            $ocModal.open({
                                id: 'add_' + goToModal,
                                url: 'partials/modals/add_' + goToModal + '.html',
                                cls: 'fade-in',
                                closeOnEsc: false,
                                controller: 'ModalController_add',
                                init: {
                                    type: $scope.startType,
                                    start: $scope.startItem,
                                    isFollowModal: true,
                                    isSelect: false
                                }
                            });
                        } else {
                            $state.reload();
                            $ocModal.close();
                            if ($scope.startType != ""){
                                $ocModal.open({
                                    id: 'add_' + $scope.startType + '_select',
                                    url: 'partials/modals/add_' + $scope.startType + '_select.html',
                                    controller: 'ModalController_add',
                                    closeOnEsc: false,
                                    cls: 'fade-in',
                                    init: {
                                        type: $scope.startType,
                                        start: $scope.startItem,
                                        isFollowModal: false,
                                        isSelect: true
                                    }
                                });
                            }
                        }
                    });
                }
            };
            $scope.saveInsurance = function (name) {
                if (vs.checkFormValidity($scope)) {
                    var dataToSend = JSON.parse(angular.toJson($scope.insuranceItem));
                    dataToSend.caravanTrailer = name == "caravan" ? {} : null;
                    dataToSend.marine = name == "marine" ? {} : null;
                    dataToSend.trauma = name == "trauma" ? {} : null;
                    dataToSend.policyExpiry = moment(dataToSend.policyExpiry, "DD/MM/YYYY").format("YYYY-MM-DDTHH:mm:ss");
                    $scope.checkForFollowUpModals();
                    dataService.post('/insure', JSON.stringify(dataToSend)).then(function (data) {
                        let ss_FollowUpModals = sessionStorage.getItem("FollowUpModals");
                        let followUpModals = (ss_FollowUpModals == "" || ss_FollowUpModals == null) ? [] : ss_FollowUpModals.split(";");
                        if (followUpModals.length > 0) {
                            let goToModal = followUpModals.shift();
                            sessionStorage.setItem("FollowUpModals", followUpModals.join(";"));
                            $ocModal.close();
                            $ocModal.open({
                                id: 'add_' + goToModal,
                                url: 'partials/modals/add_' + goToModal + '.html',
                                cls: 'fade-in',
                                closeOnEsc: false,
                                controller: 'ModalController_add',
                                init: {
                                    type: $scope.startType,
                                    start: $scope.startItem,
                                    isFollowModal: true,
                                    isSelect: false
                                }
                            });
                        } else {
                            $state.reload();
                            $ocModal.close();
                            if ($scope.startType != ""){
                                $ocModal.open({
                                    id: 'add_' + $scope.startType + '_select',
                                    url: 'partials/modals/add_' + $scope.startType + '_select.html',
                                    controller: 'ModalController_add',
                                    cls: 'fade-in',
                                    closeOnEsc: false,
                                    init: {
                                        type: $scope.startType,
                                        start: $scope.startItem,
                                        isFollowModal: false,
                                        isSelect: true
                                    }
                                });
                            }
                        }
                    });
                }
            };
            
            $scope.showOthers = function () {
                $scope.displayOthers = true;
            }
            
            $scope.resetAddObjects();

            Types.getType('institution-bank').then(function (data) { $scope.types.financialInstitutions = data });
            Types.getType('asset-cash-types').then(function (data) { $scope.types.cashTypes = data });
            Types.getType('asset-investment-types').then(function (data) { $scope.types.investmentTypes = data });
            Types.getType('asset-property-types').then(function (data) { $scope.types.propertyTypes = data });
            Types.getType('asset-vehicles-types').then(function (data) { $scope.types.luxuryItemTypes = data });
            Types.getType('asset-other-types').then(function (data) { $scope.types.otherAssetTypes = data });
            Types.getType('repayment-frequency-type').then(function (data) { $scope.types.repaymentFrequencies = data });
            Types.getType('liability-carLoan-types').then(function (data) { $scope.types.carLoanTypes = data });
            Types.getType('insurance-motor-types').then(function (data) { $scope.types.motorInsuranceTypes = data });
            dataService.get('/asset').then(function (data) { $scope.assets = data });
            dataService.get('/insure').then(function (data) { $scope.insurances = data });
            dataService.get('/liab').then(function (data) { $scope.liabilities = data });
        }
    }]);
});

