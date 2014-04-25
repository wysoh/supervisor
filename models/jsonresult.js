var util = require('util');

var VX = require('../framework/vx');


var JsonResult =  function(status, message, data){
    this.status = 1;
    this.message = null;
    this.data = null;

    if(status) this.status = status;
    if(message) this.message = message;
    if(data) this.data = data;

    this.toJson = function(){
        console.log('todo toJson');
    };

};

// sample 1 for inherits
var JsonResultSuccess = VX.inherit(JsonResult,
    {
        constructor: function (data) {
            JsonResultSuccess.__super__.constructor.call(this);
            this.data = data;
        }
    }
);

// sample 1 for inherits
var JsonResultFailure = VX.inherit(JsonResult,
    {
        constructor: function (err) {
            JsonResultFailure.__super__.constructor.call(this);

            this.status = 0;
            if(typeof(err) == "object"){
                if(err.code) this.status = err.code;
                if(err.message) this.message = err.message;
            }else{
                this.message = err;
            }

        }
    }
);

exports.JsonResult = JsonResult;
exports.JsonResultSuccess = JsonResultSuccess;
exports.JsonResultFailure = JsonResultFailure;

