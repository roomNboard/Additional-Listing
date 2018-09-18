const { Client, Pool } = require('pg');
const conString = "postgres://localhost:5432/additionallisting";

const dbConfig = {
  "host": "localhost",
  "user": "xuec",
  "database": "additionallisting",
  "port": 5432
}

const pool = new Pool(dbConfig);

pool.connect()
  .then(result => console.log('connect to postgres server'))
  .catch(err => console.log('connect to database failed ERROR: ', err))



var getListingsById = function(id, callback) {
  var queryRegionId = `SELECT properties.id, properties.region_id, properties.propertyname, properties.price, properties.numberofbedrooms, properties.rating, properties.numberofreviews, properties.roomtype, properties.instantbook, images.urlToImage FROM properties LEFT JOIN images ON properties.id = images.property_Id WHERE region_id = (SELECT region_id FROM properties WHERE id =${parseInt(id)}) ORDER BY id, rating DESC`;
  pool.query(queryRegionId)
    .then((result, error) => {
      callback(result.rows)
          
    })
    .catch(error => callback(null, error))
  
}


var addListing = function(listing, imageURLs, callback) {
  console.time('query time for adding to DB: ')
  var insertListing = `INSERT INTO properties (region_id,propertyname,price,numberOfBedrooms,rating,numberOfReviews,roomType,instantBook) VALUES (${listing}) RETURNING id`;
  pool.query(insertListing)
    .then(result => {
      var property_Id = result.rows[0].id;
      if (imageURLs.length > 0) {
        imageURLs.forEach((image) => {
        var insertImgURLs = `INSERT INTO images (property_id, urltoimage) VALUES (${property_Id},'${image}')`;
        pool.query(insertImgURLs)
          .then(res => {
            callback(res, undefined, property_Id)

          })
          .catch(error => {
            callback(undefined, error)
          });
        })
      }
      console.timeEnd('query time for adding to DB: ')
    })
    .catch(err => console.log('insert to db failed', err))
}

var newListing = `5034,'Nullam Fringilla',1189,1,5,102,'Entire Guest Suite','F'`;
var newImages = ['https://s3-us-west-1.amazonaws.com/roomsnboard/images637.jpg', 'https://s3-us-west-1.amazonaws.com/roomsnboard/images514.jpg'];
// addListing(newListing, newImages);
// getListingsById(9100019, (result) => {
//   console.log('=======',result.length);
// });

module.exports = {
  getListingsById,
  addListing
};