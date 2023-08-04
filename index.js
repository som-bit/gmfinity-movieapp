const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
// const { MongoClient, ServerApiVersion } = require('mongodb');
const session = require('express-session');
const uri = "mongodb+srv://suvrangshuroy2:CZvV7yP5oXTc2qbd@gmfinitycluster1.60runj8.mongodb.net/?retryWrites=true&w=majority";






//connecting to mongo db
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })




//middleware to use css
app.use(express.static(__dirname + "/public"));



//middleware for ejs

app.use(express.static(path.join(__dirname, 'build')));
app.set('view engine', 'ejs');
app.set('views', 'views');
//middleware for express 
app.use(express.urlencoded({ extended: true }));

//middleware for express-session
app.use(session({ secret: 'notagoodsecret' }))






//route for reg page
app.get('/register', (req, res) => {
    res.render('register');
})


//route for login page
app.get('/login', (req, res) => {
    res.render('login');
})

//for login in users
app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        req.session.user_id = user._id;
        res.redirect('/home');
    } else {
        res.send("try again");
    }

})

//for registering users
app.post('/register', async (req, res) => {

    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 12);
    const newuser = new User({
        name, email, password: hash
    })
    try {
        await newuser.save();
        req.session.user_id = user._id;
        res.redirect('/home')
    }
    catch (err) {
        res.status(404).send(err);
    }
})



//route for home page
app.get('/home', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login');
    }
    res.sendFile(path.join(__dirname + '/build/home.html'));

})

app.post('/logout', (req, res) => {
    res.session.user_id = null;
    res.redirect('/login')
})








app.listen(3000, () => {
    console.log("Serving your app");
})