var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Promotion = new Schema({

  title:    {
    type    : String,
    require : true
  }
  
});

/*Keyword.path('model').validate(function (v) {
  return ((v != "") && (v != null));
});*/

module.exports = mongoose.model('Promotion', Promotion);