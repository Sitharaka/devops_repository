const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
     task_name:{
        type: String,
        required: true,
     },
     description:{
        type: String
     },
     status:{
        type: String,
        enum: ['pending', 'failed', 'complete'],
        default: 'pending'
     },
     day:{
        type: String,
        required: true,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']        
     },
     user:{
        type:Schema.Types.ObjectId,
        ref: 'users',
        required: true
     }
},{collection: 'tasks'});

const Task = mongoose.model('tasks', taskSchema);
module.exports = Task;