/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 3/27/14
 * Time: 3:25 PM
 * To change this template use File | Settings | File Templates.
 */

var commonController = require("./controllers/common");



module.exports = function(app){
    app.get('/', commonController.pages.home);

    //app.post('/api/common/test', commonController.apis.get_data);
    app.post('/api/common/getServerNodes', commonController.apis.getServerNodes);
    app.post('/api/common/getHistoryDataByNode', commonController.apis.getHistoryDataByNode);
    app.post('/api/common/setTargetQps', commonController.apis.setTargetQps);


}