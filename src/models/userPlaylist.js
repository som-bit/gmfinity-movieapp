const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const userPlaylistSchema = new mongoose.Schema({
    playlistFolder: {
        type:ObjectId ,
        ref: 'PlaylistFolder',
    },
    movie: {
        type: ObjectId,
        ref: "Movies"
    }
})

module.exports = mongoose.model('UserPlaylist', userPlaylistSchema);