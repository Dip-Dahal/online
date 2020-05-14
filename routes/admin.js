var express = require('express');
var path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var crypto = require('crypto');
var multer = require('multer');
var mongoose = require('mongoose');

var Product = require('../models/product');
var ProductBooks = require('../models/productBooks');

mongoose.connect('mongodb://localhost:27017/shopping');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination:'./public/images',
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
    cb('Error: Images Only!');
  }
}
router.get('/uploadStationeryItems', function(req, res, next) {
  res.render('admin/uploadStationeryItems');
});
router.get('/uploadBooks', function(req, res, next) {
  res.render('admin/uploadBooks');
});

router.post('/uploadBooks',upload,function(req, res) {
  var imageFile = req.file.filename;
  var imagePath = "/images/"+imageFile;
  var title = req.body.itemName;
  var description = req.body.ItemDescription;
  var price = req.body.price;

  var products = new ProductBooks({
    imagePath: imagePath,
    title: title,
    description: description,
    price: price
  });
    products.save(function(err) {
        if(err) {
            console.log(err);
            res.status(400);
            res.send(err);
        }
        else {
          res.render('admin/uploadBooks');
        }
    });

});

router.post('/uploadStationeryItems',upload,function(req, res) {
  var imageFile = req.file.filename;
  var imagePath = "/images/"+imageFile;
  var title = req.body.itemName;
  var description = req.body.ItemDescription;
  var price = req.body.price;

  var products = new Product({
    imagePath: imagePath,
    title: title,
    description: description,
    price: price
  });
    products.save(function(err) {
        if(err) {
            console.log(err);
            res.status(400);
            res.send(err);
        }
        else {
          res.render('admin/uploadStationeryItems');
        }
    });

});
function exit(){
  mongoose.disconnect();
}

module.exports = router;
