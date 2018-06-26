const db = require('../database/index.js');
const fs = require('fs');
var cassandra = require('cassandra-driver');
const file = fs.createWriteStream('data1.csv');
var async = require('async');
var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'additionallisting'});

console.time('generate data')

const getRandomInteger = (min, max) => (Math.floor(Math.random() * (max - min + 1)) + min);

const getNumberForAllEntries = (min, max, numberOfEntries) => {
  const allValues = [];
  for (let i = 0; i < numberOfEntries; i++) {
    allValues.push(getRandomInteger(min, max));
  }
  return allValues;
};

const getRoomPicUrl = (numberOfEntries) => {
  const allUrls = [];
  for (let i = 0; i < numberOfEntries; i++) {
    for (let j = 0; j < 5; j++) {
      const imgNum = getRandomInteger(1, 655);
      allUrls.push(`'images${imgNum}.jpg'`);
    }
  }
  return allUrls;
};

const loremIpsum = [
  'Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur', 'Adipiscing',
  'Elit', 'Curabitur', 'Vel', 'Hendrerit', 'Libero', 'Eleifend', 'Blandit',
  'Nunc', 'Ornare', 'Odio', 'Ut', 'Orci', 'Gravida', 'Imperdiet', 'Nullam',
  'Purus', 'Lacinia', 'A', 'Pretium', 'Quis', 'Congue', 'Praesent', 'Sagittis',
  'Laoreet', 'Auctor', 'Mauris', 'Non', 'Velit', 'Eros', 'Dictum', 'Proin', 'Accumsan',
  'Sapien', 'Nec', 'Massa', 'Volutpat', 'Venenatis', 'Sed', 'Eu', 'Molestie', 'Lacus',
  'Quisque', 'Porttitor', 'Ligula', 'Dui', 'Mollis', 'Tempus', 'At', 'Magna', 'Vestibulum',
  'Turpis', 'Ac', 'Diam', 'Tincidunt', 'Id', 'Condimentum', 'Enim', 'Sodales', 'In',
  'Hac', 'Habitasse', 'Platea', 'Dictumst', 'Aenean', 'Neque', 'Fusce', 'Augue', 'Leo',
  'Eget', 'Semper', 'Mattis', 'Tortor', 'Scelerisque', 'Nulla', 'Interdum', 'Tellus',
  'Malesuada', 'Rhoncus', 'Porta', 'Sem', 'Aliquet', 'Et', 'Nam', 'Suspendisse', 'Potenti',
  'Vivamus', 'Luctus', 'Fringilla', 'Erat', 'Donec', 'Justo', 'Vehicula', 'Ultricies',
  'Varius', 'Ante', 'Primis', 'Faucibus', 'Ultrices', 'Posuere', 'Cubilia', 'Curae',
  'Etiam', 'Cursus', 'Aliquam', 'Quam', 'Dapibus', 'Nisl', 'Feugiat', 'Egestas',
  'Class', 'Aptent', 'Taciti', 'Sociosqu', 'Ad', 'Litora', 'Torquent', 'Per', 'Conubia',
  'Nostra', 'Inceptos', 'Himenaeos', 'Phasellus', 'Nibh', 'Pulvinar', 'Vitae', 'Urna',
  'Iaculis', 'Lobortis', 'Nisi', 'Viverra', 'Arcu', 'Morbi', 'Pellentesque', 'Metus',
  'Commodo', 'Ut', 'Facilisis', 'Felis', 'Tristique', 'Ullamcorper', 'Placerat', 'Aenean',
  'Convallis', 'Sollicitudin', 'Integer', 'Rutrum', 'Duis', 'Est', 'Etiam', 'Bibendum',
  'Donec', 'Pharetra', 'Vulputate', 'Maecenas', 'Mi', 'Fermentum', 'Consequat', 'Suscipit',
  'Aliquam', 'Habitant', 'Senectus', 'Netus', 'Fames', 'Quisque', 'Euismod', 'Curabitur',
  'Lectus', 'Elementum', 'Tempor', 'Risus', 'Cras',
];

const roomTypes = ['Entire House', 'Entire Apartment', 'Entire Guest Suite', 'Entire Guest House', 'Private Room', 'Shared Room'];

const trueFalse = [1, 0];

const getWordsForAllEntries = (words, numberOfEntries, maxNumberOfWordsInOutput) => {
  const allWords = [];
  for (let i = 0; i < numberOfEntries; i++) {
    const numberOfRandomWords = words.length;
    const numberOfWordsInName = getRandomInteger(1, maxNumberOfWordsInOutput);
    let outputWords = [];
    for (let j = 0; j < numberOfWordsInName; j++) {
      outputWords.push(words[getRandomInteger(0, numberOfRandomWords - 1)]);
    }
    outputWords = outputWords.join(' ');
    allWords.push(`'${outputWords}'`);
  }
  return allWords;
};
const numOfRecords = 400000;
let startId = 9600001;

const regionId = getNumberForAllEntries(1, 400000, numOfRecords )
const allRoomNames = getWordsForAllEntries(loremIpsum, numOfRecords, 3);
const allPrices = getNumberForAllEntries(50, 1750, numOfRecords );
const allNumberOfRooms = getNumberForAllEntries(1, 7, numOfRecords );
const allRatings = getNumberForAllEntries(1, 5, numOfRecords );
const allNumberOfReviews = getNumberForAllEntries(0, 500, numOfRecords );
const allRoomTypes = getWordsForAllEntries(roomTypes, numOfRecords, 1);
const allInstantBooks = getNumberForAllEntries(0, 1, numOfRecords );

const allUrls = getRoomPicUrl(1);

const columnData = [
  regionId,
  allRoomNames,
  allPrices,
  allNumberOfRooms,
  allRatings,
  allNumberOfReviews,
  allRoomTypes,
  allInstantBooks
];

const createRoomlistRecords = (columns) => {
  let records='';
  for (let i = 0; i < columns[0].length; i++) {
    const record = [startId + i];
    columns.forEach((column) => {
      record.push(column[i]);
    });
    let imgUrls = getRoomPicUrl(1);
    // records.push(
      // `INSERT INTO additionallisting.properties (id,region_id,propertyname,price,numberOfBedrooms,rating,numberOfReviews,roomType,instantBook,urlToImage) VALUES (${record.join(',')},[${imgUrls}])`);
    // )}
    records = records + `\n${record.join(',')},"[${imgUrls}]"`
  }
  return records;
};


const allRoomlistRecords = createRoomlistRecords(columnData);

file.write(allRoomlistRecords);
file.end();


console.timeEnd('generate data');



