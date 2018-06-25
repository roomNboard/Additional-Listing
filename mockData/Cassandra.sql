CREATE TABLE Properties (
  id int,
  region_id int,
  propertyname varchar,
  price int,
  numberOfBedrooms int,
  rating int,
  numberOfReviews int,
  roomType varchar,
  instantBook varchar,
  urlToImage list <text>,
  PRIMARY KEY (id)
);

-- CREATE TABLE images (
--   id SERIAL PRIMARY KEY,
--   property_Id int REFERENCES properties(id),
--   urlToImage varchar(255)
-- );


COPY additionallisting.properties (id,region_id,propertyname,price,numberOfBedrooms,rating,numberOfReviews,roomType,instantBook,urltoimage)
FROM '/Users/xuec/HackReactor/SDC/Additional-Listing/mockData/data.csv'  with header=true;