const db = require('../database/index.js');
const fs = require('fs');
const { Console } = require('console');
const file = fs.createWriteStream('imgs.csv');

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
    for (let j = 0; j < 6; j++) {
      const imgNum = getRandomInteger(1, 655);
      allUrls.push(`https://s3-us-west-1.amazonaws.com/roomsnboard/images${imgNum}.jpg`);
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

const trueFalse = ['T', 'F'];

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
    allWords.push(outputWords);
  }
  return allWords;
};
const numOfRecords = 5;
let startId = 10000001;

const regionId = getNumberForAllEntries(1, 400000, numOfRecords )
const allRoomNames = getWordsForAllEntries(loremIpsum, numOfRecords, 3);
const allPrices = getNumberForAllEntries(50, 1750, numOfRecords );
const allNumberOfRooms = getNumberForAllEntries(1, 7, numOfRecords );
const allRatings = getNumberForAllEntries(1, 5, numOfRecords );
const allNumberOfReviews = getNumberForAllEntries(0, 500, numOfRecords );
const allRoomTypes = getWordsForAllEntries(roomTypes, numOfRecords, 1);
const allInstantBooks = getWordsForAllEntries(trueFalse, numOfRecords, 1);

const allUrls = getRoomPicUrl(numOfRecords);

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
    const record = [];
    columns.forEach((column) => {
      record.push(column[i]);
    });
    records = `${records}\n${record.join(',')}`;
  }
  return records;
};


const createImagesRecords = (numberOfEntries, numberOfPicturesPerListing, urls) => {
  let records = '';
  let urlNumber = 0;
  for (let i = startId; i <= numberOfEntries + startId -1; i++) {
    for (let j = 0; j < numberOfPicturesPerListing; j++) {
      const record = [];
      record.push(i);
      record.push(urls[urlNumber]);
      urlNumber += 1;
      records = `${records}\n${record.join(',')}`;
    }
  }
  return records;
};

const allRoomlistRecords = createRoomlistRecords(columnData);


// db.insertRoomlistRecords(allRoomlistRecords);
// db.insertImagesRecords(allImagesRecords);

//generate and write to csv file 4M records
fs.appendFile('./data.csv', allRoomlistRecords, err => {
    err ? console.log('write file failed =======',err) : console.log('succesfully write file to data.csv')
  })
  
  // //generate and write to csv file .5M records

// let allImagesRecords = createImagesRecords(numOfRecords, 5, allUrls);
// fs.appendFile('./imgs1.csv', allImagesRecords, err => {
//   err ? console.log('write file failed =======',err) : console.log('succesfully write file to csv file')
// })







// file.write(allImagesRecords);
// file.end();


console.timeEnd('generate data');








