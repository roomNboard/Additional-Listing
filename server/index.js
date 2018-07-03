// import { CONNREFUSED } from 'dns';
const nr = require('newrelic');
const util = require('util');
const express = require('express');
const db = require('../database/index.js');
const pgDB = require('../database/postgres.js');
const path = require('path');
const redis = require('redis');

const app = express();
const port = process.env.serverPort || 3009;


const client = redis.createClient();

client.on('error', function(err) {
  console.log('Error', err)
})


app.use('/', express.static(path.join(__dirname, '/../client/dist')));
app.get('/favicon.ico', (req, res) => res.status(204));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header(
      'Access-Control-Allow-Mehods',
      'GET, POST, PUT, PATCH, DELETE'
    );
    return res.status(200).json({});
  }
  next();
});

// app.get('/filterListings/getRooms', (req, res) => {
//   db.getAllRoomlistRecords(res.send.bind(res));
//   //======require addition work to send result back to client=====//
//   // cassDB.getListingsById(param.id);
// });

// app.get('/filterListings/getImages', (req, res) => {
//   db.getAllImagesRecords(res.send.bind(res));
// });






const getListing = (req, res) => {
  let id = req.params.id;
  pgDB.getListingsById(req.params.id, (result, error) => {
    if (error) {
      res.status(404).send();
    }
    client.setex(req.params.id, 300, JSON.stringify(result));
    res.status(200).send(result)
  });
}

const getCache = (req, res) => {
  let id = req.params.id;
  client.get(id, (err, result) => {
    if (result) {
      res.status(200).send(result);
    } else {
      getListing(req, res);
    }
  })
}

app.get('/:id/listing', (req, res) => {
  getListing(req, res);
});


app.post('/:id/listing', (req, res) => {
  pgDB.addListing(req.body, () => {
    res.status(200).send();
  })
})

//CRUD
//post - add image to listing
//update - toggle instant book on listing
//delete - delete image from listing