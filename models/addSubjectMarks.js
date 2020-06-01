var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  terminal:{type:String, required:true},
  studentStream:{type:String, required:true},
  studentClass:{type:String, required:true},
  subjects:{type:String, required:true},
  theoryFM:{type:Number, required:true},
  theoryPM:{type:Number, required:true},
  practicalFM:{type:Number, required:true},
  practicalPM:{type:Number, required:true}
});

module.exports = mongoose.model('AddSubjectMark', schema);
