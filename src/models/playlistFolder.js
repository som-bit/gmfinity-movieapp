const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const playlistFolderSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        trim: true,
    },
    isLock: {
        type: Boolean,
    },
    user: {
        type: ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('PlaylistFolder', playlistFolderSchema);