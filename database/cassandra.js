var cassandra = require('cassandra-driver');
var async = require('async');
var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'additionallisting'});



var getListingsById = function(id) {
  console.time('query time');

  var regionId;
  var queryRegionId = `SELECT region_id FROM additionallisting.properties WHERE id = ${id}`;
  // client.execute(queryRegionId)
  //   .then((result) => {
  //       regionId = result.rows[0].region_id;
  //       var queryListings = `SELECT * FROM additionallisting.properties WHERE region_id = ${regionId}`;
  //       client.execute(queryListings)
  //         .then(result => console.log(result.rows))
  //         .catch(err => console.log(err))
  //   })
  //   .catch(err => console.log(err))

  client.stream(queryRegionId)
    .on('readable', function(){
      let row;
      while (row = this.read()) {
        regionId = row.region_id;
        var queryListings = `SELECT * FROM additionallisting.properties WHERE region_id = ${regionId}`;
        client.stream(queryListings)
          .on('readable', function() {
            console.log(this.read());
          })
          .on('error', function(err) {
            console.log('stream failed', err)
          });
      }
    })
    .on('end', function() {
      console.log('end of stream')
    })
    .on('error', function(err) {
      console.log('stream failed', err)
    });
  console.timeEnd('query time');
}

getListingsById(2);