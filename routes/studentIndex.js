var express = require('express');
var path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var crypto = require('crypto');
var multer = require('multer');
var mongoose = require('mongoose');

var AddStudent = require('../models/addStudent');
var AddSubject = require('../models/addSubject');
var AddSubjectMark = require('../models/addSubjectMarks');

mongoose.connect('mongodb://localhost:27017/shopping');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination:function (req, file, cb) {
    cb(null, './public/images/students');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage:storage,
  limits:{fileSize: 10000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('filename');

function checkFileType(file, cb){
  const filetypes = /jpeg|jpg|png|gif/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  }else {
    cb('/images/logo.png');
  }
}

router.get('/marksheetHome', function(req, res, next) {
  res.render('student/marksheetHome');
});


router.get('/addStudent', function(req, res, next) {
  res.render('student/addStudent');
});

router.get('/addSubject', function(req, res, next) {
  res.render('student/addSubject');
});

router.get('/addStudentDetailsBeforeMarks', function(req, res, next) {
  AddSubject.find(function(err, docs){
    var subjectChunks =[];
    var chunkSize = 4;
    for (var i = 0; i < docs.length; i += chunkSize) {
      subjectChunks.push(docs.slice(i, i += chunkSize));
    }
    res.render('student/addStudentDetailsBeforeMarks', {subjects: subjectChunks });
  }).lean();
});


router.get('/addSubjectMarks', function(req, res, next) {
  AddSubject.find(function(err, docs){
    var subjectChunks =[];
    var chunkSize = 4;
    for (var i = 0; i < docs.length; i += chunkSize) {
      subjectChunks.push(docs.slice(i, i += chunkSize));
    }
    res.render('student/addSubjectMarks', {subjects: subjectChunks });
  }).lean();
});

router.post('/addStudent',upload,function(req, res) {
  var regid = req.body.studentreg;
  var symbol = req.body.studentsym;
  var name = req.body.studentName;
  var stream = req.body.studentstream;
  var classes = req.body.studentclass;
  var sec = req.body.studentsec;
  var roll = req.body.studentroll;
  var add1 = req.body.studentAddress;
  var add2 = req.body.studentAddressNew;
  var contact1 = req.body.studentcontact;
  var contact2 = req.body.studentcontactNew;
  var parentsName1 = req.body.studentfather;
  var parentsName2 = req.body.studentMotherOrGurdian;
  var imageFile = req.file.filename;
  var imagePath = "/images/students/"+imageFile;

  var students = new AddStudent({
    studentRegid:regid,
    studentSymbol:symbol,
    studentName:name,
    studentStream:stream,
    studentClass:classes,
    studentSec:sec,
    studentRoll:roll,
    studentAddress:add1,
    studentAddressTwo:add2,
    studentContact:contact1,
    studentContactTwo:contact2,
    parentsNameOne:parentsName1,
    parentsNameTwo:parentsName2,
    imagePath:imagePath
  });
    students.save(function(err) {
        if(err) {
            console.log(err);
            res.status(400);
            res.send(err);
        }
        else {
          exit();
          res.render('student/addStudent');
        }
    });

});

router.post('/addSubject',function(req, res) {
  var stream = req.body.studentstream;
  var classes = req.body.studentclass;
  var subject = req.body.subject;

  var subjects = new AddSubject({
    studentStream:stream,
    studentClass:classes,
    studentSubject:subject
  });
  AddSubject.findOneAndDelete(
    { studentStream:stream,
    studentClass:classes,
    studentSubject:subject },

    function (err) {
    if(err) res.send('Some error occur, Refresh and try again ');
    console.log("Successful deletion");
  });

AddSubject.findOneAndUpdate(
    {studentStream:stream,
    studentClass:classes,
    studentSubject:subject}, // find a document with that filter
    subjects, // document to insert when nothing was found
    {upsert: true, new: true}, // options
    function (err, doc) { // callback
        if (err) {
          res.send('Some error occur, Refresh and try again ');// handle error
        } else {
          exit();
          res.render('student/addSubject');// handle document
        }
    });
});

router.post('/addSubjectMarks',function(req, res) {
  var terminal = req.body.terminal;
  var stream = req.body.studentstream;
  var classes = req.body.studentclass;
  var subject = req.body.subject;
  var theoryFM = req.body.theoryFM;
  var theoryPM = req.body.theoryPM;
  var practicalFM = req.body.practicalFM;
  var practicalPM = req.body.practicalPM;

  var subjectMarks = new AddSubjectMark({
    terminal:terminal,
    studentStream:stream,
    studentClass:classes,
    subjects:subject,
    theoryFM:theoryFM,
    theoryPM:theoryPM,
    practicalFM:practicalFM,
    practicalPM:practicalPM
  });
  AddSubjectMark.findOneAndDelete(
    { terminal:terminal,
    studentStream:stream,
    studentClass:classes,
    subjects:subject },

    function (err) {
    if(err) res.send('Some error occur, Refresh and try again ');
    console.log("Successful deletion");
  });

AddSubjectMark.findOneAndUpdate(
    {terminal:terminal,
    studentStream:stream,
    studentClass:classes,
    subjects:subject,
    theoryFM:theoryFM,
    theoryPM:theoryPM,
    practicalFM:practicalFM,
    practicalPM:practicalPM}, // find a document with that filter
    subjectMarks, // document to insert when nothing was found
    {upsert: true, new: true}, // options
    function (err, doc) { // callback
        if (err) {
          res.send('Some error occur, Refresh and try again ');// handle error
        } else {
          exit();
          res.render('student/addSubjectMarks');// handle document
        }
    });
});

router.post('/addStudentDetailsBeforeMarks', (req, res) => {
  var stuTerminal = req.body.terminal;
  var stream = req.body.studentstream;
  var classes = req.body.studentclass;
  var sec = req.body.studentsec;
  var subj = req.body.subject;

  AddStudent.find({
    studentStream:new RegExp(`^${stream}$`, 'i') ,
    studentClass:new RegExp(`^${classes}$`, 'i') ,
    studentSec:new RegExp(`^${sec}$`, 'i')
  },function(err, docs){
    var studentChunks =[];
    var subjectChunks =[];
    var chunkSizeForSub =0;
    var chunkSize = docs.length;
    for (var i = 0; i < docs.length; i += chunkSize) {
      studentChunks.push(docs.slice(i, i += chunkSize));
  }
    AddSubjectMark.find({
      terminal:new RegExp(`^${stuTerminal}$`, 'i') ,
      studentStream:new RegExp(`^${stream}$`, 'i') ,
      studentClass:new RegExp(`^${classes}$`, 'i') ,
      subjects:new RegExp(`^${subj}$`, 'i')
    },function(err,docs){
      chunkSizeForSub = docs.length;
      for (var i = 0; i < docs.length; i += chunkSizeForSub) {
        subjectChunks.push(docs.slice(i, i += chunkSizeForSub));
      }
    }).lean();
    res.render('student/addStudentMarks', {students: studentChunks, streamForMarks:stream,
    classForMarks:classes,
    secForMarks:sec,
    subjectForMarks:subjectChunks,
    subject:subj,
    terminal:stuTerminal
   });
  }).lean();
});


// router.post('/addStudentMarks',function(req, res) {
//   var terminal = req.body.terminal;
//   var stream = req.body.studentstream;
//   var classes = req.body.studentclass;
//   var subject = req.body.subject;
//   var theoryFM = req.body.theoryFM;
//   var theoryPM = req.body.theoryPM;
//   var practicalFM = req.body.practicalFM;
//   var practicalPM = req.body.practicalPM;
//
//   var theoryMarks = Array.prototype.slice.call(request.body.products);
// for (var i = 0; i < messages.length; i++) {
//     var newInvoice = new invoice({
//         productName: products[i].productname,
//         description: products[i].description
//     });
//     newInvoice.save();
// });
//
//   var subjectMarks = new AddSubjectMark({
//     terminal:terminal,
//     studentStream:stream,
//     studentClass:classes,
//     subjects:subject,
//     theoryFM:theoryFM,
//     theoryPM:theoryPM,
//     practicalFM:practicalFM,
//     practicalPM:practicalPM
//   });
//   AddSubjectMark.findOneAndDelete(
//     { terminal:terminal,
//     studentStream:stream,
//     studentClass:classes,
//     subjects:subject },
//
//     function (err) {
//     if(err) res.send('Some error occur, Refresh and try again ');
//     console.log("Successful deletion");
//   });
//
// AddSubjectMark.findOneAndUpdate(
//     {terminal:terminal,
//     studentStream:stream,
//     studentClass:classes,
//     subjects:subject,
//     theoryFM:theoryFM,
//     theoryPM:theoryPM,
//     practicalFM:practicalFM,
//     practicalPM:practicalPM}, // find a document with that filter
//     subjectMarks, // document to insert when nothing was found
//     {upsert: true, new: true}, // options
//     function (err, doc) { // callback
//         if (err) {
//           res.send('Some error occur, Refresh and try again ');// handle error
//         } else {
//           exit();
//           res.render('student/addSubjectMarks');// handle document
//         }
//     });
// });
//


function exit(){
  mongoose.disconnect();
}

module.exports = router;
