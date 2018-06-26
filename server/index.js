// import { CONNREFUSED } from 'dns';

const express = require('express');
const db = require('../database/index.js');
const cassDB =require('../database/cassandra.js');
const path = require('path');

const app = express();
const port = process.env.serverPort || 3004;

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

app.get('/filterListings/getRooms', (req, res) => {
  db.getAllRoomlistRecords(res.send.bind(res));
  //======require addition work to send result back to client=====//
  // cassDB.getListingsById(param.id);
});

app.get('/filterListings/getImages', (req, res) => {
  db.getAllImagesRecords(res.send.bind(res));
});


//CRUD
//post - add image to listing
//update - toggle instant book on listing
//delete - delete image from listing