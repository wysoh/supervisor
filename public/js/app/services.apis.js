/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/1/14
 * Time: 4:14 AM
 * To change this template use File | Settings | File Templates.
 */

angular.module('allyes.services.apis',[])
    .factory('commonAPIService', ['ajax', function(ajax){
        return {
            getData: function(data, ops){
                var srcOps = {
                    url: '/api/common/test',
                    data: {id: data}
                };

                return ajax.post(ops, srcOps);

            },


            getServerNodes : function(data, ops){
                var srcOps = {
                    url: '/api/common/getServerNodes'

                };

                return ajax.post(ops, srcOps);
            },

            getHistoryDataByNode: function(data, ops){
                var srcOps = {
                    url: '/api/common/getHistoryDataByNode',
                    data: data
                };

                return ajax.post(ops, srcOps);

            },

            setTargetQps: function(data, ops){
                var srcOps = {
                    url: '/api/common/setTargetQps',
                    data: data
                };
                return ajax.post(ops, srcOps);
            }


        }
    }])
;