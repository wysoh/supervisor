/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/1/14
 * Time: 4:07 AM
 * To change this template use File | Settings | File Templates.
 */

angular.module('allyes.services',[])
    .factory('ajax', ['$http','$q', function ($http,$q) {
        return {
            sendRequest: function(options){
                var deferred = $q.defer(),
                    promise = deferred.promise;

                promise.success = function(fn) {
                    promise.then(function(result) {
                        fn(result);
                    });
                    return promise;
                };

                promise.error = function(fn) {
                    promise.then(null, function(result) {
                        fn(result);
                    });
                    return promise;
                };

                var config = {
                    method:         'GET',
                    url:            '',
                    params:         null,
                    data:           null,
                    headers:        null,
                    successFn:      null,
                    errorFn:        null,
                    waitingElement: null,
                    data:           '',
                    isNeedShowWaiting: true
                };
                var opt = angular.extend(config, options);
                // TODO: show block on waitingElement
                if(opt.isNeedShowWaiting){
                    VX.UI.showWaiting(null, true);
                }

                $http(
                    {
                        method:     opt.method,
                        url:        opt.url,
                        data:       opt.data,
                        headers:    opt.headers
                    }
                ).
                    success(function(data, status, headers, config) {
                        // TODO: hide block on waitingElement
                        if(opt.isNeedShowWaiting) VX.UI.showWaiting(null, false);
                        if(data.status == 1){
                            deferred.resolve(data);
                        }else{
                            if(data.status == 990){
                                window.location.reload(); // reload page when session expired
                            }else{
                                deferred.reject(data);
                            }
                        }
                    }).
                    error(function(data, status, headers, config) {
                        // TODO: hide block on waitingElement
                        if(opt.isNeedShowWaiting) VX.UI.showWaiting(null, false);
                        deferred.reject(data);
                    });

                return promise;
            },

            post: function(options, srcOptions){
                options = options || {};
                var defaultOpt = {method: 'POST'}
                var opt = angular.extend(options, defaultOpt);
                if(srcOptions){
                    opt = angular.extend(opt, srcOptions);
                }
                return this.sendRequest(opt);
            },

            get: function(options, srcOptions){
                options = options || {};
                var defaultOpt = {method: 'GET'}
                var opt = angular.extend(options, defaultOpt);
                if(srcOptions){
                    opt = angular.extend(opt, srcOptions);
                }
                return this.sendRequest(opt);
            }
        };
}])
    .factory('commonService', ['commonAPIService', function(commonAPIService){
        return {
            getData:function(data, success, error){
                commonAPIService.get_data(data)
                    .success(function(rst){
                        success(rst);
                    })
                    .error(function(data){
                        error(data);
                    })

            },

            getServerNodes:function(success, error){
                commonAPIService.getServerNodes()
                    .success(function(rst){
                        success(rst);
                    })
                    .error(function(data){
                        error(data);
                    })
            },

            getHistoryDataByNode: function(data, success, error){
                commonAPIService.getHistoryDataByNode(data)
                    .success(function(rst){
                        success(rst);
                    })
                    .error(function(data){
                        error(data);
                    })
            }

        }
    }]);