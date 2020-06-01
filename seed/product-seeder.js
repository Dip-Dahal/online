var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://tikaramdahal.dahal@gmail.com:Nungsidip@98@mycluster-aacac.mongodb.net/test?retryWrites=true&w=majority/shopping');

var products = [
  new Product({
    imagePath: '/images/physics.jpg',
    title: 'Physics Grade XI',
    description: 'By: Salvatore Magazu',
    price: 560
  }),
  new Product({
    imagePath: '/images/chemistry.jpg',
    title: 'Chemistry Grade XI',
    description: 'By: Derek B. Lowe',
    price: 560
  }),
  new Product({
    imagePath: '/images/bio.jpg',
    title: 'Biology Grade XI',
    description: 'By: Miller Levine',
    price: 560
  }),
  new Product({
    imagePath: '/images/chemistry.jpg',
    title: 'Chemisty Grade XI',
    description: 'By: Derek B. Lowe',
    price: 560
  }),
  new Product({
    imagePath: '/images/physics.jpg',
    title: 'Physics Grade XI',
    description: 'By: Salvatore Magazu',
    price: 560
  }),
];

var done=0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result){
    done++;
    if(done===products.length){
      exit();
    }
  });
}

function exit(){
  mongoose.disconnect();
}
