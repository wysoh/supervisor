/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/1/14
 * Time: 2:20 AM
 * To change this template use File | Settings | File Templates.
 */
'use strict';

angular.module('allyes.controllers',["allyes.controllers.common"]);

angular.module('allyes.controllers.common', []).
    controller('BasePageCtrl', ['$scope', '$rootScope', 'commonService',
        function($scope, $rootScope, commonService){
            var vm = $scope.vm = {};
            var fn = $scope.fn = {};

            vm.serverNodes = {};

            fn.get_api = function(){
                commonService.get_data(
                    {test: vm.test},
                    function(rst){
                    },
                    function(data){
                         alert('error: ' + data);
                    }
                )
            };


            fn.initTabs = function(){
                commonService.getServerNodes(
                    function(rst){

                        vm.serverNodes.server = rst.data.server;
                        vm.serverNodes.dispatcher = rst.data.dispatcher;
                        vm.serverNodes.dspclient = rst.data.dspclient;

                        vm.tabs = VX.UI.tabs.build([
                            {code:"server", title: "Servers", selected:true, nodes: vm.serverNodes.server},
                            {code:"dispatcher", title: "Dispatchers", nodes: vm.serverNodes.dispatcher},
                            {code:"dspclient", title: "DSP Clients", nodes: vm.serverNodes.dspclient}
                        ]);

                        vm.tabs.afterSelect = function(code){
                            $rootScope.$broadcast('TAB_CLICK', {tab: code });
                        };

                        selectedTab = vm.tabs.tabItems[0].code;
                        fn.buildSecondTabs(vm.tabs.tabItems[0].nodes);
                        selectedSecondTab = vm.secondTabs.tabItems[0].code;

                        fn.initChart();
                    }

                    //function(data){console.log('error:' + data);}

                )

            }

            fn.buildSecondTabs = function(items){
                var tabs = [];
                var item = {};
                $.each(items, function(i, v){
                    item = {code: v, title: v, selected:i==0};
                    tabs.push(item);

                })

                vm.secondTabs = VX.UI.tabs.build(tabs);
                vm.secondTabs.afterSelect = function(code){
                    $rootScope.$broadcast('TAB_CLICK', {tab: code });
                };
            },

            fn.selectTab = function(tabItem){
                tabItem.onSelect();
                selectedTab = tabItem.code;
                fn.buildSecondTabs(tabItem.nodes);
                selectedSecondTab = vm.secondTabs.tabItems[0].code;
                fn.initChart();
                //console.log(tab_item);

            },

            fn.selectSecondTab = function(tabItem){
                tabItem.onSelect();
                selectedSecondTab = tabItem.code;
                fn.initChart();
            },

            fn.initChart = function(){

                commonService.getHistoryDataByNode({sg: selectedTab, si: selectedSecondTab},
                    function(rst){
                        chartData.length = 0;
                        updateChart(rst.data);
                    },
                    function(error){
                        console.log('error' + error);
                    }
                )
            }



        }])
;
