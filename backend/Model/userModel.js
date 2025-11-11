const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String, 
        required: true,
    },
    gmail:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    task: [{type: Schema.Types.ObjectId, ref: 'tasks'}]
}, {collection: 'users'});

const User = mongoose.model('users', userSchema);
module.exports = User;