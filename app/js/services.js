'use strict';

define(['angular'], function (angular) {

    let adminServices = angular.module('adminServices', []);

    adminServices.factory('ConfigService', [function () {
        // declare all of the api bases for each of the services
        this.apiBase = {
            types: 'https://localhost:4000'
        };
        return this;
    }]);
    
    adminServices.service('dataService', ['$http', '$q', '$state', function ($http, $q, $state) {
        this.apiBase = urls.api;
        //Request Type: GET
        this.get = function (path) {
            return $http.get(this.apiBase + path, {
                headers: {
                    "Authorization": "Bearer accesstoken"
                }
            })
            .then(function (response) {
                if (response.data.result === undefined) {
                    return response.data;
                } else {
                    if (response.data.result != "success") {
                        if (response.data.errors != null && response.data.errors.length > 0) {
                            response.data.errors.forEach(function logArrayElements(element, index, array) {
                                if (element != undefined && element.indexOf("Redirection:") == 0) {
                                    var redir = element.split(": ");
                                    if (redir[1] == 'smsVerification') { $state.go("sign-up.verify-sms"); }
                                    if (redir[1] == 'acceptTerms') { $state.go("sign-up.accept-terms"); }
                                    return false;
                                }
                                if (element == "Terms and conditions already accepted") {
                                    console.info("Redirect to 'Download Digital Safe'");
                                }
                            });
                        }
                        return false;
                    } else {
                        return response.data.data;
                    }
                }
            }, function (response) {
                return $q.reject(response);
            });
        };
        this.getWithToken = function (path, access_token) {
            return $http.get(this.apiBase + path, {
                headers: {
                    "Authorization": "Bearer " + access_token
                }
            })
            .then(function (response) {
                if (response.data.result === undefined) {
                    return response.data;
                } else {
                    if (response.data.result != "success") {
                        if (response.data.errors != null && response.data.errors.length > 0) {
                            response.data.errors.forEach(function logArrayElements(element, index, array) {
                                if (element != undefined && element.indexOf("Redirection:") == 0) {
                                    var redir = element.split(": ");
                                    if (redir[1] == 'smsVerification') { $state.go("sign-up.verify-sms"); }
                                    if (redir[1] == 'acceptTerms') { $state.go("sign-up.accept-terms"); }
                                    return false;
                                }
                                if (element == "Terms and conditions already accepted") {
                                    console.info("Redirect to 'Download Digital Safe'");
                                }
                            });
                        }
                        return false;
                    } else {
                        return response.data.data;
                    }
                }
            }, function (response) {
                return $q.reject(response);
            });
        };
        //Request Type: POST
        this.post = function (path, data) {
            return $http.post(this.apiBase + path, data, {
                headers: {
                    "Authorization": "Bearer accesstoken"
                }
            })
            .then(function (response) {
                if (response.data.result === undefined) {
                    return response.data;
                } else {
                    if (response.data.result != "success") {
                        console.error(response.data.errors);
                    } else {
                        return response.data.data;
                    }
                }
            }, function (response) {
                return $q.reject(response);
            });
        };
        //Request Type: PUT
        this.put = function (path, data) {
            return $http.put(this.apiBase + path, data, {
                headers: {
                    "Authorization": "Bearer accesstoken"
                }
            })
            .then(function (response) {
                if (response.data.result === undefined) {
                    return response.data;
                } else {
                    if (response.data.result != "success") {
                        console.error(response.data.errors);
                    } else {
                        return response.data.data;
                    }
                }
            }, function (response) {
                return $q.reject(response);
            });
        };
        //Request Type: DELETE
        this.delete = function (path) {
            return $http.delete(this.apiBase + path, {
                headers: {
                    "Authorization": "Bearer accesstoken"
                }
            })
            .then(function (response) {
                if (response.data.result === undefined) {
                    return response.data;
                } else {
                    if (response.data.result != "success") {
                        console.error(response.data.errors);
                    } else {
                        return response.data.data;
                    }
                }
            }, function (response) {
                return $q.reject(response);
            });
        };
    }])
    
    adminServices.service('GraphService', ['moment', function (moment) {
        //Chart Type: Bar Graph
        this.CreateBarGraphNet = function (data, colours) {
            var barGraph = {
                labels: [],
                data: [[]],
                colours: [colours[0]],
                options: {
                    scaleBeginAtZero: false,
                    scaleGridLineColor: "rgba(0,0,0,0.1)",
                    scaleShowVerticalLines: false,
                    barShowStroke: true,
                    barStrokeWidth: 1,
                    barValueSpacing: 10,
                    barBeginAtOrigin: true,
                    scaleLabel: function (valuePayload) {
                        var returnValue = valuePayload.value
                        try {
                            returnValue = Number(valuePayload.value).toLocaleString();
                        } catch (e) { }
                        return "$" + returnValue;
                    },
                    tooltipFillColor: "#FFFFFF",
                    tooltipFontColor: "#5b5b5b",
                    tooltipTemplate: function (valuePayload) {
                        var returnValue = valuePayload.value
                        try {
                            returnValue = Number(valuePayload.value).toLocaleString();
                        } catch (e) { }
                        return "$" + returnValue;
                    }
                    //scaleOverride: true,
                    //scaleSteps: 10,
                    //scaleStartValue: 0
                }
            };
            var maxBarValue = 0;
            for (var i = 0; i < data.length; i++) {
                if (moment(data[i].startDate).format('MMM') == moment().format('MMM') && moment(data[i].startDate).format('YYYY') == moment().format('YYYY')) {
                    barGraph.labels.push("This month");
                } else {
                    barGraph.labels.push(moment(data[i].startDate).format('MMM YY'));
                }
                barGraph.data[0].push(data[i].netValue);
                if (data[i].netValue > maxBarValue) { maxBarValue = data[i].netValue; }
            }
            if ((maxBarValue / 100000) - parseInt(maxBarValue / 100000) > 0) { maxBarValue = (parseInt(maxBarValue / 100000) + 1) * 100000 }
            //barGraph.options.scaleStepWidth = (maxBarValue / barGraph.options.scaleSteps);
            return barGraph;
        };
        this.CreateBarGraphAsset = function (data, colours) {
            var barGraph = {
                labels: [],
                data: [[]],
                colours: [colours[0]],
                options: {
                    scaleBeginAtZero: false,
                    scaleGridLineColor: "rgba(0,0,0,0.1)",
                    scaleShowVerticalLines: false,
                    barShowStroke: true,
                    barStrokeWidth: 1,
                    barValueSpacing: 10,
                    barBeginAtOrigin: true,
                    scaleLabel: function (valuePayload) {
                        var returnValue = valuePayload.value
                        try {
                            returnValue = Number(valuePayload.value).toLocaleString();
                        } catch (e) { }
                        return "$" + returnValue;
                    },
                    tooltipFillColor: "#FFFFFF",
                    tooltipFontColor: "#5b5b5b",
                    tooltipTemplate: function (valuePayload) {
                        var returnValue = valuePayload.value
                        try {
                            returnValue = Number(valuePayload.value).toLocaleString();
                        } catch (e) { }
                        return "$" + returnValue;
                    }
                    //scaleOverride: true,
                    //scaleSteps: 10,
                    //scaleStartValue: 0
                }
            };
            var maxBarValue = 0;
            for (var i = 0; i < data.length; i++) {
                if (moment(data[i].startDate).format('MMM') == moment().format('MMM') && moment(data[i].startDate).format('YYYY') == moment().format('YYYY')) {
                    barGraph.labels.push("This month");
                } else {
                    barGraph.labels.push(moment(data[i].startDate).format('MMM YY'));
                }
                barGraph.data[0].push(data[i].assetValue);
                if (data[i].assetValue > maxBarValue) { maxBarValue = data[i].assetValue; }
            }
            if ((maxBarValue / 100000) - parseInt(maxBarValue / 100000) > 0) { maxBarValue = (parseInt(maxBarValue / 100000) + 1) * 100000 }
            //barGraph.options.scaleStepWidth = (maxBarValue / barGraph.options.scaleSteps);
            return barGraph;
        };
        this.CreateBarGraphLiability = function (data, colours) {
            var barGraph = {
                labels: [],
                data: [[]],
                colours: [colours[0]],
                options: {
                    scaleBeginAtZero: false,
                    scaleGridLineColor: "rgba(0,0,0,0.1)",
                    scaleShowVerticalLines: false,
                    barShowStroke: true,
                    barStrokeWidth: 1,
                    barValueSpacing: 10,
                    barBeginAtOrigin: true,
                    scaleLabel: function (valuePayload) {
                        var returnValue = valuePayload.value
                        try {
                            returnValue = Number(valuePayload.value).toLocaleString();
                        } catch (e) { }
                        return "$" + returnValue;
                    },
                    tooltipFillColor: "#FFFFFF",
                    tooltipFontColor: "#5b5b5b",
                    tooltipTemplate: function (valuePayload) {
                        var returnValue = valuePayload.value
                        try {
                            returnValue = Number(valuePayload.value).toLocaleString();
                        } catch (e) { }
                        return "$" + returnValue;
                    }
                    //scaleOverride: true,
                    //scaleSteps: 10,
                    //scaleStartValue: 0
                }
            };
            var maxBarValue = 0;
            for (var i = 0; i < data.length; i++) {
                if (moment(data[i].startDate).format('MMM') == moment().format('MMM') && moment(data[i].startDate).format('YYYY') == moment().format('YYYY')) {
                    barGraph.labels.push("This month");
                } else {
                    barGraph.labels.push(moment(data[i].startDate).format('MMM YY'));
                }
                barGraph.data[0].push(data[i].liabilityValue);
                if (data[i].liabilityValue > maxBarValue) { maxBarValue = data[i].liabilityValue; }
            }
            if ((maxBarValue / 100000) - parseInt(maxBarValue / 100000) > 0) { maxBarValue = (parseInt(maxBarValue / 100000) + 1) * 100000 }
            //barGraph.options.scaleStepWidth = (maxBarValue / barGraph.options.scaleSteps);
            return barGraph;
        };
        //Chart Type: Doughnut Graph
        this.CreateDoughnutGraphs = function (data, colours, linkRoot) {
            var graph = {}
            var out = []
            var prefill = 0;
            for (var i = 0; i < data.length; i++) {
                graph = {};
                graph.labels = ["", data[i].type.name, ""];
                graph.data = [prefill, data[i].percentage, (100 - prefill - data[i].percentage)];
                graph.colours = ["#e0e0e0", colours[data[i].type.name], "#e0e0e0"];
                graph.options = { segmentShowStroke: false, reponsive: true, maintainAspectRatio: true, showTooltips: false, percentageInnerCutout: 60 };
                graph.amount = data[i].total;
                graph.displayData = Math.round(data[i].percentage);
                graph.linkLocation = linkRoot + "-" + (data[i].type.name).replace(/[^a-zA-Z]/g, "").toLowerCase();
                out.push(graph);
                prefill += data[i].percentage;
            }
            return out;
        };
        this.CreateDoughnutGraphsSub = function (data, color, subCategories) {
            var graphData = [];
            var overallTotal = data.total;
            for (var i = 0; i < subCategories.length; i++) {
                graphData[subCategories[i].id] = { "id": subCategories[i].id, "name": subCategories[i].name, "percentage": 0, "total": 0 };
            }
            data.entities.forEach(function logArrayElements(elementA, indexA, arrayA){
                elementA.accounts.forEach(function logArrayElements(elementB, indexB, arrayB){
                    graphData[elementB.type.id].total += elementB.balance;
                });
            });
            graphData.forEach(function logArrayElements(elementA, indexA, arrayA){
                elementA.percentage = (elementA.total / overallTotal) * 100;
            });
            var graph = {}
            var out = []
            var prefill = 0;
            graphData.forEach(function logArrayElements(elementA, indexA, arrayA){
                if (elementA.total > 0) {
                    graph = {};
                    graph.labels = ["", elementA.name, ""];
                    graph.data = [prefill, elementA.percentage, (100 - prefill - elementA.percentage)];
                    graph.colours = ["#e0e0e0", color, "#e0e0e0"];
                    graph.options = { segmentShowStroke: false, reponsive: true, maintainAspectRatio: true, showTooltips: false, percentageInnerCutout: 60 };
                    graph.amount = elementA.total;
                    graph.displayData = Math.round(elementA.percentage);
                    out.push(graph);
                    prefill += elementA.percentage;
                }
            });
            return out;
        };
        this.CreateDoughnutGraphsInst = function (data, color) {
            var graphData = [];
            var overallTotal = data.total;
            data.entities.forEach(function logArrayElements(elementA, indexA, arrayA){
                var instID = elementA.institution.id == null ? 0 : elementA.institution.id;
                graphData[instID] = { "id": elementA.institution.id, "name": elementA.institution.name, "percentage": 0, "total": 0 };
                elementA.accounts.forEach(function logArrayElements(elementB, indexB, arrayB){
                    graphData[instID].total += elementB.balance;
                });
            });
            graphData.forEach(function logArrayElements(elementA, indexA, arrayA){
                elementA.percentage = (elementA.total / overallTotal) * 100;
            });
            var graph = {}
            var out = []
            var prefill = 0;
            graphData.forEach(function logArrayElements(elementA, indexA, arrayA){
                if (elementA.total > 0) {
                    graph = {};
                    graph.labels = ["", elementA.name, ""];
                    graph.data = [prefill, elementA.percentage, (100 - prefill - elementA.percentage)];
                    graph.colours = ["#e0e0e0", color, "#e0e0e0"];
                    graph.options = { segmentShowStroke: false, reponsive: true, maintainAspectRatio: true, showTooltips: false, percentageInnerCutout: 60 };
                    graph.amount = elementA.total;
                    graph.displayData = Math.round(elementA.percentage);
                    out.push(graph);
                    prefill += elementA.percentage;
                }
            });
            return out;
        };
    }])
});