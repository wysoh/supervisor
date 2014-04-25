var utils = require('../framework/common/utils')

function SSO(){
    this.uId = null;
    this.createdDate = null;   // mill seconds

    this.isValid = function(){
        var exp_date = new Date( this.createdDate + 30 * 60 * 1000); //exp in 30 minutes
        var current_date = new Date();
        if(current_date > exp_date){
            return false;
        }

        return true;
    };

} ;

module.exports = SSO;

module.exports.getEncodedStr = function(userId) {

    var c_time = (new Date()).getTime();

    var jsonObj = {
        'userId': userId,
        'createdTime':c_time
    }
    var jsonStr = JSON.stringify(jsonObj) ;

    var encryptTxt = utils.ThreeDesEncrypt(jsonStr);

    return encryptTxt;
};

module.exports.loadFromEncodedStr = function(encodedStr) {

    try{
        var jsonStr = utils.ThreeDesDecrypt(encodedStr);
        var jsonObj = JSON.parse(jsonStr);

        var sso = new SSO();
        sso.uId = jsonObj['userId'] ;
        sso.createdDate = jsonObj['createdTime'];
        return sso;
    }catch(e){
        return null;
    }

};