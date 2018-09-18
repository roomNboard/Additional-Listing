var cassandra = require('cassandra-driver');
var async = require('async');
var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'additionallisting'});



var getListingsById = function(id) {
  console.time('query time');

  var regionId;
  var queryRegionId = `SELECT region_id FROM additionallisting.properties WHERE id = ${id}`;
  client.execute(queryRegionId)
    .then((result) => {
        regionId = result.rows[0].region_id;
        var queryListings = `SELECT * FROM additionallisting.properties WHERE region_id = ${regionId} allow filtering`;
        client.execute(queryListings)
          .then(result => {
            console.log('number of listing: ',result.rows)
            console.timeEnd('query time');
        
          })
          .catch(err => console.log(err))
    })
    .catch(err => console.log(err))

  // client.stream(queryRegionId)
  //   .on('readable', function(){
  //     let row;
  //     while (row = this.read()) {
  //       regionId = row.region_id;
  //       var queryListings = `SELECT * FROM additionallisting.properties WHERE region_id = ${regionId} allow filtering`;
  //       client.stream(queryListings)
  //         .on('readable', function() {
  //           console.log(this.read());
  //           console.timeEnd('query time');
  //         })
  //         .on('error', function(err) {
  //           console.log('stream failed', err)
  //         });
  //     }
  //   })
  //   .on('end', function() {
  //     console.log('end of stream')
     
  //   })
  //   .on('error', function(err) {
  //     console.log('stream failed', err)
  //   });

}

var addListing = function(listing) {
  console.time('add listing')
  var insertListing = `INSERT INTO additionalListing.properties (id,region_id,propertyname,price,numberOfBedrooms,rating,numberOfReviews,roomType,instantBook,urltoimage) VALUES (${listing})`
  // var insertListing =[{query: insertQuery, params: listing}]
  client.execute(insertListing)
  .then(result => {
    console.timeEnd('add listing')
    console.log('Added listing to database')
    })
    .catch(err => console.log(err))
}

var newListing =  `10000004,342198,'Mattis Nisi',730,7,4,84,'Entire Guest House','F',['https://s3-us-west-1.amazonaws.com/roomsnboard/images546.jpg','https://s3-us-west-1.amazonaws.com/roomsnboard/images316.jpg','https://s3-us-west-1.amazonaws.com/roomsnboard/images330.jpg','https://s3-us-west-1.amazonaws.com/roomsnboard/images366.jpg','https://s3-us-west-1.amazonaws.com/roomsnboard/images350.jpg']`;


// addListing(newListing);
getListingsById(9000003);

module.exports= {getListingsById};

// INSERT INTO additionalListing.properties (id,region_id,propertyname,price,numberOfBedrooms,rating,numberOfReviews,roomType,instantBook,urltoimage) VALUES (10000001,391990,'Eros At',1629,3,2,210,'Entire Guest Suite','T',"['https://s3-us-west-1.amazonaws.com/roomsnboard/images570.jpg','https://s3-us-west-1.amazonaws.com/roomsnboard/images62.jpg','https://s3-us-west-1.amazonaws.com/roomsnboard/images636.jpg','https://s3-us-west-1.amazonaws.com/roomsnboard/images317.jpg','https://s3-us-west-1.amazonaws.com/roomsnboard/images651.jpg']");