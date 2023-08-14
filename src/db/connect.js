const mongoose = require("mongoose");


const connectDB = async (url) => {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MONGO CONNECTION OPEN!!!");
    } catch (err) {
        console.log("OH NO MONGO CONNECTION ERROR!!!!");
        console.log(err);
    }
};
module.exports = connectDB;