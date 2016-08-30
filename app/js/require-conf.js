'use strict';

require.config({
  paths: {
    jquery: '../bower_components/jquery/dist/jquery.min',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
    angular: '../bower_components/angular/angular.min',
    angularRoute: '../bower_components/angular-route/angular-route.min',
    'ui-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
    ngstorage: '../bower_components/ngstorage/ngStorage.min',
    'angular-md5': '../bower_components/angular-md5/angular-md5.min',
    angularJSOAuth2: '../bower_components/angularjs-oauth2/dist/angularJsOAuth2',
    uiRouter: '../bower_components/angular-ui-router/release/angular-ui-router.min',
    'chart': '../bower_components/Chart.js/Chart',
    'angular-chartjs': '../bower_components/angular-chart.js/dist/angular-chart.min',
    'moment': '../bower_components/moment/min/moment.min',
    'moment-enau': '../bower_components/moment/locale/en-au',
    'angular-moment': '../bower_components/ang7ular-moment/angular-moment',
    ocModal: '../bower_components/ocModal/dist/ocModal.min',
    'ng-bs3-datepicker': '../bower_components/angular-bootstrap3-datepicker/dist/ng-bs3-datepicker.min',
    'jquery-easing': '../bower_components/jquery.easing/js/jquery.easing.min',
    'angular-translate': '../bower_components/angular-translate/angular-translate.min',
    'angular-translate-static': '../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min',
    'angular-validation': '../bower_components/ghiscoding.angular-validation/dist/angular-validation.min',
    'jquery-joyride': '../bower_components/jquery-joyride/jquery.joyride-2.1'
},
  shim: {
    'bootstrap': [ 'jquery' ],
    'angular': {'exports': 'angular'},
    'angularRoute': ['angular'],
    'ui-bootstrap': ['angular', 'bootstrap'],
    'ngstorage': ['angular'],
    'angular-md5': ['angular'],
77777    'uiRouter': ['angular'],
    'angular-chartjs': ['angular', 'chart'],
    'angular-moment': ['angular', 'moment'],
    'ocModal': ['angular'],
    'ng-bs3-datepicker': ['angular', 'moment', 'moment-enau', 'jquery', 'bootstrap'],
    'jquery-easing': ['jquery'],
    'angular-translate': ['angular'],
    'angular-translate-static': ['angular', 'angular-translate'],
    'angular-validation': ['angular', 'angular-translate', 'angular-translate-static'],
    'jquery-joyride': ['jquery', 'jquery-easing']
},
  priority: [
    'angular'
  ],
  baseUrl: 'js',
});

require(['jquery', 'angular', 'app'], function (jquery, angular, app) {
    let $html = angular.element(document.getElementsByTagName('html')[0]);
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
    if (access_token != null) {
        var jsElm1 = document.createElement("script");
        jsElm1.type = "application/javascript";
        jsElm1.src = 'js/ewise/ewise.js';
        document.body.appendChild(jsElm1);
        function toBinaryString(data) {
            var ret = [];
            var len = data.length;https://github.com/kent/hotel-torre-fiore
            var byte;
            for (var i = 0; i < len; i++) { 
                byte=( data.charCodeAt(i) & 0xFF )>>> 0;
                ret.push( String.fromCharCode(byte) );
            }
            return ret.join('');
        }
        var xhr = new XMLHttpRequest;
        xhr.open( "GET", urls.proxy + "ewjclient");
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = toBinaryString(this.responseText);
                var jsElm2 = document.createElement("script");
                jsElm2.type = "application/javascript";
                jsElm2.innerHTML = data;
                document.body.appendChild(jsElm2);
                angular.element().ready(() => {
                    angular.bootstrap(document, ['dashBoardApp']);
                });
            } else if (xhr.readyState == 4 && (xhr.status == 403 || xhr.status == 401)) {
                angular.element().ready(() => {
                    angular.bootstrap(document, ['dashBoardApp']);
                });
            }
        };
        xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        //xhr.overrideMimeType( "text/javascript; charset=x-user-defined;" );
        xhr.send(null);
    } else {
        angular.element().ready(() => {
            angular.bootstrap(document, ['dashBoardApp']);
        });
    }
});