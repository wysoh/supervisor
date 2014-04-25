/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/1/14
 * Time: 2:11 AM
 * To change this template use File | Settings | File Templates.
 */

'use strict';

if (!window.allyes){
    window.allyes = {};
}

angular.module('templates-partials', []);
angular.module('allyes', ['ui.bootstrap', 'allyes.filters', 'allyes.services', 'allyes.services.apis', 'allyes.directives','allyes.controllers'])
    .run(['$rootScope', function($rootScope){
       $rootScope.isEmpty =  function(v){
           return _.isEmpty(v);
       }

    }]);