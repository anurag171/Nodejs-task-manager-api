const mongoose = require('mongoose')
var validator = require('validator')
const bcrypt = require('bcryptjs')
const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim: true,
        unique:true
    },
    completed:{
        type:Boolean,
        required:false,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    }
},{
    timestamps:true
})

const TaskModel =mongoose.model('Task',taskSchema)

module.exports=TaskModel