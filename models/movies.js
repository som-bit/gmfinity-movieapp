const axios = require('axios');
const mongoose = require('mongoose');
const generateSchema = require('generate-schema');

const uri = 'https://www.omdbapi.com/?i=tt0800080&apikey=9c148ccf';



const movieSchema = new mongoose.Schema(
    {
    Title: { type: 'String' },
    Year: { type: 'Date' },
    Rated: { type: 'String' },
    Released: { type: 'Date' },
    Runtime: { type: 'String' },
    Genre: { type: 'String' },
    Director: { type: 'String' },
    Writer: { type: 'String' },
    Actors: { type: 'String' },
    Plot: { type: 'String' },
    Language: { type: 'String' },
    Country: { type: 'String' },
    Awards: { type: 'String' },
    Poster: { type: 'String' },
    Ratings: { type: ['Mixed'] },
    Metascore: { type: 'Date' },
    imdbRating: { type: 'Date' },
    imdbVotes: { type: 'String' },
    imdbID: { type: 'String' },
    Type: { type: 'String' },
    DVD: { type: 'Date' },
    BoxOffice: { type: 'String' },
    Production: { type: 'String' },
    Website: { type: 'String' },
    Response: { type: 'String' }
    }
)


module.exports = mongoose.model('Movies', movieSchema);

// axios.get(uri)
//     .then(response => {
//         // console.log('Response:', response.data);
//         MongooseSchema = generateSchema.mongoose(response.data);
//         console.log(MongooseSchema);


//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });


// console.log(mongoose.model('Moviedata', MongooseSchema));

// const getMovieSchema = async (uri) => {
//     let val = (await axios.get(uri)).data
//     const MongooseSchema = generateSchema.mongoose(val);
//     return await mongoose.model('Moviedata', MongooseSchema);
// }
// module.exports = { getMovieSchema }

