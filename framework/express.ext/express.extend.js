/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 3/27/14
 * Time: 8:17 PM
 * To change this template use File | Settings | File Templates.
 */

var util = require('util');
var models = require('../../models');
var JsonResultSuccess = models.JsonResultSuccess;
var JsonResultFailed = models.JsonResultFailure;
var conf = require('../../config').config;


module.exports = function (express) {
    setup_global_locals = function(req, res){
        var isAjax = req.xhr;
        if(isAjax){
            return;
        }

    };

    // extend express/lib/response render method
    express.response.render = function(view, options, fn){
        var self = this
            , options = options || {}
            , req = this.req
            , app = req.app;

        // support callback function as second arg
        if ('function' == typeof options) {
            fn = options, options = {};
        }

        // clude: added below line to support global locals
        setup_global_locals(req, self);

        // merge res.locals
        options._locals = self.locals;

        // default callback to respond
        fn = fn || function(err, str){
            if (err) return req.next(err);
            self.send(str);
        };

        // render
        app.render(view, options, fn);
    };


    express.response.render_tpl = function(tpl, options, fn) {
        options = options || {};
        options = util._extend(options, {tpl_path: tpl});
        this.render('masterpage/tpl_base', options, fn);
    };

    express.response.render_error = function(errors, options, fn) {
        options = options || {};
        options = util._extend(options, {errors: errors});
        this.render('home/exception', options, fn);
    };

    express.response.json_success = function(data, code) {
        code = code || 1;
        var rst = new JsonResultSuccess(data);
        rst.status = code;
        this.json(rst);
    };

    express.response.json_error = function(error, code) {
        code = code || 0;
        var rst = new JsonResultFailed(error);
        rst.status = code;
        this.json(rst);
    };

    express.response.json_complete = function(err, data, code) {
        if(err) return this.json_error(err, code);
        return this.json_success(data, code);
    };

};