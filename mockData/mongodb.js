var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect()

var Properties = new Schema ({
  id: Number,
  region_id: Number,
  propertyname: String,
  price: Number,
  numberOfBedrooms: Number,
  rating: Number,
  numberOfReviews: Number,
  roomType: String,
  instantBook: String,
  urlToImage: Array
});

var additionalListing = mongoose.model('additionalListing', Properties);