var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  studentRegid:{type:String},
  studentSymbol:{type:String},
  studentName:{type:String, required:true},
  studentStream:{type:String, required:true},
  studentClass:{type:String, required:true},
  studentSec:{type:String, required:true},
  studentRoll:{type:Number, required:true},
  studentAddress:{type:String},
  studentAddressTwo:{type:String},
  studentContact:{type:String},
  studentContactTwo:{type:String},
  parentsNameOne:{type:String},
  parentsNameTwo:{type:String},
  imagePath:{type:String}
});

module.exports = mongoose.model('AddStudent', schema);
