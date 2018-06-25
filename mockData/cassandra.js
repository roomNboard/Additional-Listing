var cassandra = require('cassandra-driver');
var async = require('async');
var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'addtionallisting'});

const allRoomlistRecords = createRoomlistRecords(columnData);

console.log(allRoomlistRecords);

// function() {
//   client.batch(
//     !err ? console.log('Number of rows inserted',result.length) : console.log('seeding failed') 
//   })
//   }
// select * from additionallisting.properties;