const express = require('express');
const cors = require('cors')
const app = express();
const User = require('./models/user');
const PlaylistFolder = require('./models/playlistFolder');
const UserPlaylist = require('./models/userPlaylist');
const Movies = require('./models/movies');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
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

app.use(cors())
//middleware for express 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
   
}))


//for login in users
app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        console.log(user._id.toString());
        req.session.user = user._id.toString();
        const token = jwt.sign({ _id: user._id }, "keyboard cat", {
            expiresIn: "1d",
        });
        res.cookie("token", token, { expiresIn: "1d" });
        req.user_id = user._id.toString();
        req.session.save(function (err) {
            if (err) return next(err)
            res.redirect('http://localhost:5500/home.html');
        })

    } else {
        res.send("try again");
    }
})


async function userAuth(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Not authorized" })
            } else {
                if (decodedToken.role !== "Basic") {
                    return res.status(401).json({ message: "Not authorized" })
                } else {
                    next()
                }
            }
        })
    }
}


// 
app.get('/playlistFolder', async (req, res) => {
    const userId = '64ceaab5d21172de78feda7c';
    console.log(userId);
    // console.log(req.session);
    const val = await PlaylistFolder.find({
        user: userId
    })
    console.log(val);
    res.status(200).json({
        data: val
    })
})


async function getUserPlayListByIds({ folderId, movieId }) {
    const checkedMovie = await UserPlaylist.findOne({
        playlistFolder: folderId,
        movie: movieId
    })
    console.log(checkedMovie);
    return checkedMovie;
}



async function getUserPlayList({ folderId }) {
    return await UserPlaylist.find({
        playlistFolder: folderId
    }).populate(["movie","playlistFolder"]);
}


async function createUserPlaylist(folderId, movieId) {
    const getUserPlaylist = await getUserPlayListByIds({ folderId, movieId });
    console.log("getUserPlaylist value: ", getUserPlaylist);
    if (getUserPlaylist == null) {
        const userPlaylist = new UserPlaylist({
            playlistFolder: folderId,
            movie: movieId
        })
        await userPlaylist.save();
    }
}


app.post('/movie', async (req, res) => {
    const { Title, imdbID, Poster, Year } = req.body.favMovie;
    const folderId = req.body.folderId;
    // console.log('folderId', folderId);
    const value = await Movies.findOne({
        imdbID
    })
    console.log(req.body);
    console.log(value);
    if (value != null) {

        createUserPlaylist(folderId, value._id);
    }
    else {
        const newMovie = new Movies({
            Title,
            imdbID,
            Poster,
            Year
        })
        try {
            const movie = await newMovie.save();
            console.log("saved");
            createUserPlaylist(folderId, movie._id);
            res.json({
                status: "success",
                msg: "data saved to db"
            })

        }
        catch (err) {
            console.log(err);
            res.status(404).send(err);
        }
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
        const user = await newuser.save();

        const playlistFolderData = [
            {
                name: "private",
                isLock: true,
                user: user._id,
            },
            {
                name: "public",
                isLock: false,
                user: user._id,
            },
        ];
        Promise.all(
            playlistFolderData.map((data) => new PlaylistFolder(data).save())
        )
            .then((savedPlaylistFolders) => {
                console.log("PlaylistFolders saved successfully:", savedPlaylistFolders);
            })
            .catch((error) => {
                console.error("Error while saving PlaylistFolders:", error);
            });


        // Assuming playlistFolderData is an array containing valid data

        // req.session.user_id = user._id;
        res.redirect('http://localhost:5500/home.html');
    }
    catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
})

app.get('/getUserPlaylist/:folderId',async (req, res) => {
    const folderId = req.params.folderId;
    const val = await getUserPlayList({ folderId });
    console.log(val);
    res.status(200).json(val);
})

//route for home page
app.get('/home', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login');
    }
    res.sendFile(path.join(__dirname + '/home.html'));

})

app.post('/logout', (req, res) => {
    res.session.user_id = null;
    res.redirect('/login')
})

app.listen(3000, () => {
    console.log("Serving your app");
})