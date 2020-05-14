var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Cart = require('../models/cart');


var Product = require('../models/product');
var ProductBooks = require('../models/productBooks');

var csrfProtection = csrf();
router.use(csrfProtection);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('management/index', { title: 'Creative Stationary and Books' });
});

router.get('/stationery', function(req, res, next) {
  Product.find(function(err, docs){
    var productChunks =[];
    var chunkSize = 4;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i+chunkSize));
    }
    res.render('management/stationery', {products: productChunks });
  }).lean();
});

router.get('/books', function(req, res, next) {
  ProductBooks.find(function(err, docs){
    var productChunks =[];
    var chunkSize = 4;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i+chunkSize));
    }
    res.render('management/books', {products: productChunks });
  }).lean();
});


var productId={};
var cart={};
router.get('/add-to-cart/:id', function(req, res, next){
   productId = req.params.id;
   cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product){
    if(err) {
      return res.redirect('/stationery');
    }
    cart.add(product, product.id);
    req.session.cart = cart;

    res.redirect('/stationery')
  });
});

router.get('/add-to-cart-Books/:id', function(req, res, next){
   productId = req.params.id;
   cart = new Cart(req.session.cart ? req.session.cart : {});
  ProductBooks.findById(productId, function(err, product){
    if(err) {
      return res.redirect('/books');
    }
    cart.add(product, product.id);
    req.session.cart = cart;

    res.redirect('/books')
  });
});

router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('management/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('management/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

module.exports = router;
