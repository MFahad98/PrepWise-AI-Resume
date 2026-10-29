let mongoose = require("mongoose")

let userSchema= new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"username already taken"],
        require:true,
    },
       email:{
        type:String,
        unique:[true,"email already exist"],
        require:true,
    },
       password:{
        type:String, 
        require:true,
    }
})

const userModel = mongoose.model("users",userSchema)

module.exports=userModel