;(function() {
    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this;

//    var vx = function(obj) {
//        if (obj instanceof _) return obj;
//        if (!(this instanceof _)) return new _(obj);
//        this._wrapped = obj;
//    };

    var vx = { version: '1.0'};

    if(root._){
        var _ = root._;
    }else{
        if (typeof exports !== 'undefined') {
            _ = require('underscore');
        }
    }

    // Export the vx object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `VX` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = vx;
        }
        exports.VX = vx;
    } else {
        root.VX = vx;
    }

    vx.hasProp = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    vx.deleteProp = function(obj, prop) {
        if(vx.hasProp(obj, prop)){
            delete obj[prop];
        }
    };

    /*
    * isCopyAll: when true, do not check the target property, copy all values from source even when the target do not have the property
    *            when false or null, need to check whether the target has the same property
    * */
    vx.copyProps = function(target, source, isCopyAll){
        isCopyAll = isCopyAll || false;
        if(target && source){
            for(var p in source){
                // p is method
                if(typeof(source[p])=="function"){
                    // do nothing
                }else{
                    if(isCopyAll) {
                        target[p] = source[p];
                    } else{
                        if(vx.hasProp(target, p)){
                            target[p] = source[p];
                        }
                    }
                }
            }
        }
    };

    vx.compareAndRemoveProps = function(target, source){
        var newDict = {};
        if(target && source){
            for(var p in source){
                // p is method
                if(typeof(source[p])=="function"){
                    // do nothing
                }else{
                    if(vx.hasProp(target, p)){
                        newDict[p] = source[p];
                    }
                }
            }
        }
        return newDict;
    };

    vx.inherit = function(parent, protoProps, staticProps) {
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ parent.apply(this, arguments); };
        }

        // Inherit class (static) properties from parent.
        _.extend(child, parent);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        function ctor() {}
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Add static properties to the constructor function, if supplied.
        if (staticProps) _.extend(child, staticProps);

        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;

        // Set a convenience property in case the parent's prototype is needed later.
        child.__super__ = parent.prototype;

        return child;
    };

    vx.classExtends = function(protoProps, classProps) {
        return vx.inherit(this, protoProps, classProps);
    };

    vx.format = function() {
        if (arguments.length == 0)
            return null;

        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    };

    vx.getPropertyValueList = function(sources, propName){
        var results = [];
        if(sources){
            for(var k in sources){
                var v = sources[k][propName];
                if(v){
                    results.push(v);
                }
            }
        }
        return results;
    };

    vx.format_date = function (date, friendly) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        if (friendly) {
            var now = new Date();
            var mseconds = -(date.getTime() - now.getTime());
            var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000 ];
            if (mseconds < time_std[4]) {
                if (mseconds > 0 && mseconds < time_std[1]) {
                    return Math.floor(mseconds / time_std[0]).toString() + ' Second(s) Ago';
                }
                if (mseconds > time_std[1] && mseconds < time_std[2]) {
                    return Math.floor(mseconds / time_std[1]).toString() + ' Minute(s) Ago';
                }
                if (mseconds > time_std[2] && mseconds < time_std[3]) {
                    return Math.floor(mseconds / time_std[2]).toString() + ' Hour(s) Ago';
                }
                if (mseconds > time_std[3]) {
                    return Math.floor(mseconds / time_std[3]).toString() + ' Day(s) Ago';
                }
            }
        }

        //month = ((month < 10) ? '0' : '') + month;
        //day = ((day < 10) ? '0' : '') + day;
        hour = ((hour < 10) ? '0' : '') + hour;
        minute = ((minute < 10) ? '0' : '') + minute;
        second = ((second < 10) ? '0': '') + second;

        var thisYear = new Date().getFullYear();
        year = (thisYear === year) ? '' : (year + '-');
        return year + month + '-' + day + ' ' + hour + ':' + minute;
    };

    vx.getClientIP=function(req){
        var ip=req.header('X-Forwarded-For');
        if(ip && !_.isEmpty(ip)) {
            var ips=ip.split(",");
            return ips[0];
        }else{
            return req.connection.remoteAddress;
        }
    };

    vx.isImageFile =  function(fileName) {
        var regex = new RegExp('(jpeg|png|gif|jpg)$', 'i');
        return regex.test(fileName);
    };

}).call(this);

