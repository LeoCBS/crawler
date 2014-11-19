var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Keyword = new Schema({

  keyword:    {
    type    : String,
    require : true
  }
  
});

/*Keyword.path('model').validate(function (v) {
  return ((v != "") && (v != null));
});*/

module.exports = mongoose.model('Keyword', Keyword);