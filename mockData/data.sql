
\c additionallisting;

CREATE TABLE Properties (
  id SERIAL PRIMARY KEY NOT NULL,
  region_id int NOT NULL,
  propertyname varchar (50) NOT NULL,
  price int NOT NULL,
  numberOfBedrooms int NOT NULL,
  rating int NOT NULL,
  numberOfReviews int NOT NULL,
  roomType varchar (20) NOT NULL,
  instantBook varchar (1) NOT NULL
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  urlToImage varchar(255) NOT NULL,
  property_Id int
);

-- //add 2.5M records
-- COPY Properties (region_id,propertyname,price,numberOfBedrooms,rating,numberOfReviews,roomType,instantBook)
-- FROM '/Users/xuec/HackReactor/SDC/Additional-Listing/mockData/data.csv' with DELIMITER ',' csv header;

-- add 4M records Properties Table
COPY Properties (region_id,propertyname,price,numberOfBedrooms,rating,numberOfReviews,roomType,instantBook)
FROM '/Users/xuec/HackReactor/SDC/Additional-Listing/mockData/data2.csv' with DELIMITER ',' csv header;


COPY images (urlToImage,property_Id)
FROM '/Users/xuec/HackReactor/SDC/Additional-Listing/mockData/imgs.csv' with DELIMITER ',';
