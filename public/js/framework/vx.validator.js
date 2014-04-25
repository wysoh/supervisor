/**
 * Created with IntelliJ IDEA.
 * User: zhuclude
 * Date: 7/16/13
 * Time: 11:26 AM
 * To change this template use File | Settings | File Templates.
 */

;(function() {

    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this;

    var vCheck;
    var vSanitize;
    if(root.Validator){
        vCheck = root.check;
        vSanitize = root.sanitize;
    }else{
        if (typeof exports !== 'undefined') {
            vCheck = require('validator').check;
            vSanitize =  require('validator').sanitize;
        }
    };



    var vLibMethods = {
        email :             'isEmail',
        url:                'isUrl',
        ip:                 'isIP',
        ipv4:               'isIPv4',
        ipv6:               'isIPv6',
        alpha:              'isAlpha',
        alphanumeric:       'isAlphanumeric',
        numeric:            'isNumeric',
        int:                'isInt',
        decimal:            'isDecimal',
        required:           'notNull',
        date:               'isDate',
        creditcard:         'isCreditCard'
    }

    var validator = {
         check: function(method, val, option){
             var isValid = false;

             method = vSanitize(method).trim();
             switch(method){
                 case 'required':
                     isValid = this.normalCheck(method, val, option);
                     break;
                 case 'strongpwd':
                     isValid = this.isStrongPwd(val);
                     break;
                 case 'uimask':
                     isValid = this.isFullUIMaskRegexMatch(val);
                     break;
                 case 'hasNumber':
                     isValid = this.isHasMaskNumber(val);
                     break;
                 default:
                     if(!val) return true;
                     isValid = this.normalCheck(method, val, option);
                     break;
             }

             return  isValid;

         },

        normalCheck: function(method, val, option){
            var isValid = false;
            if(Object.prototype.hasOwnProperty.call(vLibMethods, method)){
                var vMth =  vLibMethods[method];
                try {
                    vCheck(val)[vMth]();
                    isValid = true;
                } catch (e) {
                    isValid = false;
                };
            } else {
                isValid = false;
                //throw Error('Method does not exists');
            }

            return isValid;
        },

        isStrongPwd: function(p){
            var _regex = /[$-/:-?{-~!"@#^_`\[\]\\]/g;
            var _lowerLetters = /[a-z]+/.test(p);
            var _upperLetters = /[A-Z]+/.test(p);
            var _numbers = /[0-9]+/.test(p);
            var _symbols = _regex.test(p);

            if(p.length >=8 && _lowerLetters && _upperLetters && _numbers && _symbols) {
                return true;
            }else {
                return false;
            }
        },

        isFullUIMaskRegexMatch:function(v){
            if(v){
                if(v.indexOf("_") >= 0){
                    return false;
                }
            }
            return true;
        },
        isHasMaskNumber:function(n){
            if(n){
              return  /\d+/.test(n);
            }
        }
    };



    VX.Validator = validator;

}).call(this);
