var expect = require('chai').expect;
var request = require('request');
var pgDB = require('../database/postgres.js');
const { Client, Pool } = require('pg');


describe('server', function() {
  // Further code for tests goes here
  it('should respond to GET request for /9900000/listing with a 200 status code', (done) => {
    request('http://localhost:3009/9900000/listing', (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should send back an array for GET request for /9900000/listing', function(done) {
    request('http://localhost:3009/9900000/listing', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('array');
      done();
    });
  });

  it('should respond with 404 status code to GET request if product id does not exist ', function(done) {
    request('http://localhost:3009/id/listing', function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

});


  describe('database', function() {
    const dbConfig = {
      'host': 'localhost',
      'user': 'xuec',
      'database': 'additionallisting',
      'port': 5432
    }
    
    const pool = new Pool(dbConfig);
    
    pool.connect()
      .then(result => console.log('connect to postgres server'))
      .catch(err => console.log('connect to database failed ERROR: ', err))


    it('Should retreive listings by product id', function(done) {
      pgDB.getListingsById(400000, (results, error) => {
        expect(results.length).to.equal(125);
      })
      done();
    })

    it('Should return null if product id does not exist', function(done) {
      pgDB.getListingsById('id', (res, err) => {
        expect(res).to.equal(null);
      })
      done();
    })


    it('Should insert posted listing to the DB', function(done) {
      var newListing = `5034,'Nullam Fringilla',1189,1,5,102,'Entire Guest Suite','F'`;
      var newImages = ['https://s3-us-west-1.amazonaws.com/roomsnboard/images637.jpg', 'https://s3-us-west-1.amazonaws.com/roomsnboard/images514.jpg'];
      
      pgDB.addListing(newListing, newImages, (result, error, prodId) => {
        console.log(prodId);
        var query = `SELECT property_id FROM images WHERE property_id = ${prodId}`
        pool.query(query)
          .then((result, error) => {
            expect(result.rows[0].property_id).to.equal(prodId)
            var deleteQuery =  `DELETE FROM properties WHERE id = ${prodId}`
            pool.query(deleteQuery)
          })
      })
      done();
    })    

  })