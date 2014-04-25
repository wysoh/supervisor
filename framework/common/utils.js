var xss = require('xss');
var util = require("util");

var crypto = require('crypto');
var Buffer = require('buffer').Buffer;
var SECRET_KEY = "ChuckN0rrisL1kesPur3D3PapaSuperKey";
var _ = require('underscore');

exports.format_date = function (date, friendly) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if (friendly) {
        var now = new Date();
        var mseconds = -(date.getTime() - now.getTime());
        var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
        if (mseconds < time_std[3]) {
            if (mseconds > 0 && mseconds < time_std[1]) {
                return Math.floor(mseconds / time_std[0]).toString() + ' Second(s) Ago';
            }
            if (mseconds > time_std[1] && mseconds < time_std[2]) {
                return Math.floor(mseconds / time_std[1]).toString() + ' Minute(s) Ago';
            }
            if (mseconds > time_std[2]) {
                return Math.floor(mseconds / time_std[2]).toString() + ' Hour(s) Ago';
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

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function (html) {
    var codeSpan = /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm;
    var codeBlock = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g;
    var spans = [];
    var blocks = [];
    var text = String(html).replace(/\r\n/g, '\n')
        .replace('/\r/g', '\n');

    text = '\n\n' + text + '\n\n';

    text = text.replace(codeSpan, function (code) {
        spans.push(code);
        return '`span`';
    });

    text += '~0';

    return text.replace(codeBlock, function (whole, code, nextChar) {
        blocks.push(code);
        return '\n\tblock' + nextChar;
    })
        .replace(/&(?!\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/`span`/g, function () {
            return spans.shift();
        })
        .replace(/\n\tblock/g, function () {
            return blocks.shift();
        })
        .replace(/~0$/, '')
        .replace(/^\n\n/, '')
        .replace(/\n\n$/, '');
};

/**
 * XSS Configuration
 */
var xssOptions = {
    whiteList: {
        h1:     [],
        h2:     [],
        h3:     [],
        h4:     [],
        h5:     [],
        h6:     [],
        hr:     [],
        span:   [],
        strong: [],
        b:      [],
        i:      [],
        br:     [],
        p:      [],
        pre:    [],
        code:   [],
        a:      ['target', 'href', 'title'],
        img:    ['src', 'alt', 'title'],
        div:    [],
        table:  ['width', 'border'],
        tr:     [],
        td:     ['width', 'colspan'],
        th:     ['width', 'colspan'],
        tbody:  [],
        ul:     [],
        li:     [],
        ol:     [],
        dl:     [],
        dt:     [],
        em:     [],
        cite:   [],
        section:[],
        header: [],
        footer: [],
        blockquote: [],
        audio:  ['autoplay', 'controls', 'loop', 'preload', 'src'],
        video:  ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width']
    }
};

/**
 * filter xss code
 *
 * @param {string} html
 * @return {string}
 */
exports.xss = function (html) {
    return xss(html, xssOptions);
};

exports.MD5 = function(str, encoding) {
    return crypto.createHash('md5').update(str).digest(encoding || 'hex');
};

exports.HmacMD5 = function(str, pwd, encoding) {
    return crypto.createHmac('md5', pwd).update(str).digest(encoding || 'hex');
};

exports.SHA256 = function(str, encoding) {
    return crypto.createHash('sha256').update(str).digest(encoding || 'hex');
};

exports.HmacSHA256 = function(str, pwd, encoding) {
    return crypto.createHmac('sha256', pwd).update(str).digest(encoding || 'hex');
};

exports.ThreeDesEncrypt = function(text){
    var ENCODING = 'hex';
    var cipher = crypto.createCipher('des-ede3-cbc', SECRET_KEY);
    var cryptedPassword = cipher.update(text, 'utf8',ENCODING);
    cryptedPassword+= cipher.final(ENCODING);
    return cryptedPassword;
};

exports.ThreeDesDecrypt = function(text){
    var ENCODING = 'hex';
    var decipher = crypto.createDecipher('des-ede3-cbc', SECRET_KEY);
    var decryptedPassword = decipher.update(text, ENCODING,'utf8');
    decryptedPassword += decipher.final('utf8');
    return decryptedPassword;
};

var __hasProp = {}.hasOwnProperty;
var __extends = function(parent,child) {
    for (var key in parent) {
        if (__hasProp.call(parent, key))
            child[key] = parent[key];
    }

    function ctor() {
        this.constructor = child;
    }

    ctor.prototype = parent.prototype;

    child.prototype = new ctor();
    child.__super__ = parent.prototype;

    return child;
};

var _inherits = function(parent, protoProps, staticProps) {
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

var _extends = function(protoProps, classProps) {
    return _inherits(this, protoProps, classProps);
};

exports.inherits = _inherits;
exports.inheritsV2 = __extends;
exports.extends = _extends;


