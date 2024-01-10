const mongoose = require('mongoose');

// Create a new shcema and pass it to server.js
const filesSchema = new mongoose.Schema({
    _id: String,
    fileName: String,
    totalParts: Number,
})

const fileModel = mongoose.model("files", filesSchema)
module.exports = fileModel;