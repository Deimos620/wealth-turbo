'use strict';

define(['angular'], function (angular) {

  let adminDirectives = angular.module('adminDirectives', []);
  
  adminDirectives.directive('disableChildren', function() {
    return {
      require: '^form',
      restrict: 'A',
      link: function(scope, element, attrs,form) {
        var control;

        scope.$watch(function() {
          return scope.$eval(attrs.disableChildren);
        }, function(value) {
          if (!control) {
            control = form[element.find("input").attr("name")];
          }
          if (value === false) {
            form.$addControl(control);
            angular.forEach(control.$error, function(validity, validationToken) {
              form.$setValidity(validationToken, !validity, control);
            });
          } else {
            form.$removeControl(control);
          }
        });
      }
    }
  });

  adminDirectives.directive('jsonText', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {            
          function into(input) {
            return JSON.parse(input);
          }
          function out(data) {
            return JSON.stringify(data);
          }
          ngModel.$parsers.push(into);
          ngModel.$formatters.push(out);

        }
    };
  });

  adminDirectives.directive('toggle' , function() {
    return {
      restrict: 'A',
      link: function(scope , element , attrs){
        if(attrs.toggle=="tooltip"){
          $(element).tooltip();
        }
        if(attrs.toggle=="popover"){
          $(element).popover();
        }
      }
    };
  });
});