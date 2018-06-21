const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'xuec',
  database: 'AdditionalListing'
})

CREATE DATABASE AdditionalListing;


pool.query('COPY Properties FROM ‘./data.txt’ WITH DELIMITER ‘,’;', (err, res) => {
  console.log(err, res)
  pool.end()
})
