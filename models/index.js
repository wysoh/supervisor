var sso = require('./sso')
var jsonrst = require('./jsonresult')

exports.SSO = sso;
exports.JsonResult = jsonrst.JsonResult;
exports.JsonResultSuccess = jsonrst.JsonResultSuccess;
exports.JsonResultFailure = jsonrst.JsonResultFailure;