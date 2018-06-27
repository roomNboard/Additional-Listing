const pg = require('pg')
const conString = "postgres://localhost:5432/additionallisting";

// {
//   PGHOST: 'localhost',
//   DATABASE: 'additionallisting',
//   PGUSER: 'xuec',
//   PGPASSWORD:null,
//   PGPORT: 5432
// }

const client = new pg.Client(conString);

client.connect()
  .then(result => console.log('connect to postgres server'))
  .catch(err => console.log('connect to database failed ERROR: ', err))




var getListingsById = function(id) {
  console.time('get listing by ID query time: ')
  var queryRegionId = `SELECT properties.id, properties.region_id, properties.propertyname, properties.price, properties.numberofbedrooms, properties.rating, properties.numberofreviews, properties.roomtype, properties.instantbook, images.urlToImage FROM properties LEFT JOIN images ON properties.id = images.property_Id WHERE region_id = (SELECT region_id FROM properties WHERE id =${id}) ORDER BY id, rating DESC`;
  // var queryRegionId = `SELECT * FROM properties WHERE region_id = (SELECT region_id FROM properties WHERE id =${id})`;
  client.query(queryRegionId)
    .then(result => {
      console.log('query result======', result.rows)
      var regionId = result.rows[0].region_id;

      // var queryListings = `SELECT * FROM properties LEFT JOIN images ON properties.id = images.property_id WHERE properties.region_id = ${regionId}`;
      // client.query(queryListings)
      //   .then(res => {
      //     console.log(res.rows.length)

          // var queryImages = 'SELECT * FROM images WHERE '
          console.timeEnd('get listing by ID query time: ')
          client.end()
        // })
        // .catch(error => console.log('query listing failed ERROR: ', error))
    })
    .catch(err => console.log('query failed ERROR: ', err))
  
}

getListingsById(9000007);

var addListing = function(listing, imageURLs) {
  console.time('query time for adding to DB: ')
  var insertListing = `INSERT INTO properties (region_id,propertyname,price,numberOfBedrooms,rating,numberOfReviews,roomType,instantBook) VALUES (${listing}) RETURNING id`;
  console.log(insertListing);
  client.query(insertListing)
    .then(result => {
      console.log('Added listing to DB', result.rows[0].id)
      var property_Id = result.rows[0].id;
      if (imageURLs.length > 0) {
        imageURLs.forEach((image) => {
        var insertImgURLs = `INSERT INTO images (property_id, urltoimage) VALUES (${property_Id},'${image}')`;
        console.log(insertImgURLs);
        client.query(insertImgURLs)
          .then(res => {
            console.log('Add images to DB')
           
          })
          .catch(error => console.log('insert images to db failed', error));
        })
      }
      console.timeEnd('query time for adding to DB: ')
    })
    .catch(err => console.log('insert to db failed', err))
}

var newListing = `5034,'Nullam Fringilla',1189,1,5,102,'Entire Guest Suite','F'`;
var newImages = ['https://s3-us-west-1.amazonaws.com/roomsnboard/images637.jpg', 'https://s3-us-west-1.amazonaws.com/roomsnboard/images514.jpg'];
// addListing(newListing, newImages);