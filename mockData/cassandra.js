var cassandra = require('cassandra-driver');
var async = require('async');


INSERT INTO additionallisting.properties (id,region_id,propertyname,price,numberOfBedrooms,rating,numberOfReviews,roomType,instantBook,urlToImage)
VALUES (1, 334389,'Felis',653,4,1,410,'Entire Guest Suite','T', 
  ['https://s3-us-west-1.amazonaws.com/roomsnboard/images189.jpg','https://s3-us-west-1.amazonaws.com/roomsnboard/images561.jpg'])

// select * from additionallisting.properties;