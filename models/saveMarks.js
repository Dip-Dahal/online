var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  terminal:{type:String, required:true},
  studentStream:{type:String, required:true},
  studentClass:{type:String, required:true},
  subjects:{type:String, required:true},
  theoryMarks:{type: Number }
  practicalMarks:{type: Number }
});


module.exports = mongoose.model('saveStudentMarks', schema);
