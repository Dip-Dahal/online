var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  studentStream:{type:String, required:true},
  studentClass:{type:String, required:true},
  studentSubject:{type:String, required:true}
});

module.exports = mongoose.model('AddSubject', schema);
