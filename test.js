const axios = require('axios');
const mongoose = require('mongoose');
const generateSchema = require('generate-schema');

const uri = 'https://www.omdbapi.com/?i=tt0800080&apikey=9c148ccf';

axios.get(uri)
  .then(response => {
    
      const MongooseSchema = generateSchema.mongoose(response.data);
    
      console.log(MongooseSchema);
  })
  .catch(error => {
    console.error('Error:', error);
  });



