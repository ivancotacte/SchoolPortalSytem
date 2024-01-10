const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    middlename: { 
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    emailaddress: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("User", UserSchema);