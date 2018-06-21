
\c additionallisting;

CREATE TABLE Properties (
  region_id int NOT NULL,
  propertyname varchar (50) NOT NULL,
  price int NOT NULL,
  numberOfBedrooms int NOT NULL,
  rating int NOT NULL,
  numberOfReviews int NOT NULL,
  roomType varchar (20) NOT NULL,
  instantBook varchar (1) NOT NULL
);


COPY Properties (region_id,propertyname,price,numberOfBedrooms,rating,numberOfReviews,roomType,instantBook)
FROM '/Users/xuec/HackReactor/SDC/Additional-Listing/mockData/data.csv' with DELIMITER ',' csv header;
