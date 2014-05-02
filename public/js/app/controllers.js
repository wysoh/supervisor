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
            vm.hasManualRatio = false;
            vm.dspErrorCodes = ["1000", "2022", "2027", "2028"];
            vm.controlHistory = [];

            vm.manualRatio = 100;

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
                        vm.serverNodes.dsp = rst.data.dsp;

                        vm.tabs = VX.UI.tabs.build([
                            {code:"server", title: "Servers", selected:true, nodes: vm.serverNodes.server},
                            {code:"dispatcher", title: "Dispatchers", nodes: vm.serverNodes.dispatcher},
                            {code:"dsp", title: "DSP Clients", nodes: vm.serverNodes.dsp}
                        ]);

                        vm.tabs.afterSelect = function(code){
                            $rootScope.$broadcast('TAB_CLICK', {tab: code });
                        };

                        vm.selectedServerGroup = vm.tabs.tabItems[0].code;
                        fn.buildSecondTabs(vm.tabs.tabItems[0].nodes);
                        vm.selectedServerInstance = vm.secondTabs.tabItems[0].code;

                        fn.initChart();
                        fn.initStreaming();

                    }
                );


            };

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
            };

            fn.selectTab = function(tabItem){
                tabItem.onSelect();
                vm.selectedServerGroup = tabItem.code;
                fn.buildSecondTabs(tabItem.nodes);
                vm.selectedServerInstance = vm.secondTabs.tabItems[0].code;
                fn.initChart();
            };

            fn.selectSecondTab = function(tabItem){
                tabItem.onSelect();
                vm.selectedServerInstance = tabItem.code;
                fn.initChart();
            };

            fn.initChart = function(){
                vm.currentDSPError = '';
                vm.currentQps = '';
                vm.currentRatio = '';
                vm.controlHistory.length = 0;

                commonService.getHistoryDataByNode({sg: vm.selectedServerGroup, si: vm.selectedServerInstance},
                    function(rst){
                        vm.currentQps = rst.data.control.qps;
                        vm.currentRatio = rst.data.control.ratio;
                        vm.targetQps = rst.data.control.targetQps;

                        chartData.length = 0;
                        updateChart(rst.data.monitor);
                    },
                    function(error){
                        console.log('error' + error);
                    }
                )
            };

            fn.initStreaming = function(){
                var socket = io.connect('/');
                socket.on("update", function (update) {
                    if (!(vm.selectedServerGroup == update.sg && vm.selectedServerInstance == update.si)){
                        return;
                    }

                    $.each(chartData, function(i, v){
                        var series = v.key;
                        var lastEntry = v.values[v.values.length-1];

                        var tick = update[series];
                        if (lastEntry.x == tick.x){
                            lastEntry.y = tick.y;
                        }else{
                            v.values.push(tick);
                            //only keep the last 300 entries, about 5 hours worth of data
                            if (v.values.length > 300) {
                                v.values.shift();
                            }
                        };
                    });

                    vm.currentQps = update.QPS.y;
                    $scope.$apply();
                    chart.update();
                    fn.updateDSPError();
                });

                socket.on('control', function(control){
                    if (!(vm.selectedServerGroup == control.sg && vm.selectedServerInstance == control.si)){
                        return;
                    }

                    console.log(control);
                    vm.currentRatio = control.ratio;
                    vm.controlHistory.push(control);
                    if (vm.controlHistory.length > 10){
                        vm.controlHistory.shift();
                    }
                    $scope.$apply();

                });
            };

            fn.updateDSPError = function(){
                vm.currentDSPError = 0;
                if(vm.selectedServerGroup == 'dsp'){
                    $.each(chartData, function(i, v){
                        $.each(vm.dspErrorCodes, function(j, w){
                            if (v.key == w){
                                vm.currentDSPError += v.values[v.values.length-1].y;
                            }
                        })
                    });

                    $scope.$apply();
                }

            };

            fn.setTargetQps = function(){
                //we should get a validation framework ie. angular validation
                if (isNaN(vm.targetQps)){
                    alert('请输入极限QPS的数值');
                    return;
                }
                commonService.setTargetQps({sg: vm.selectedServerGroup, si: vm.selectedServerInstance, qps: vm.targetQps},
                    function(rst){
                        alert('更新成功!');
                    },
                    function(error){
                        console.log('error' + error);
                    }
                )
            };

            fn.formatTime = function(ts){
                var d = new Date(ts * 1000);
                var month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);

                return d.getFullYear() + '-' + month  + '-' + d.getDate() + ' ' +
                    d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

            }


        }])
;
