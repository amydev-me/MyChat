const mongoose=require('mongoose');

const EmployeeSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    }, 
    email:{
        type:String,
        required: true,
        unique: true
    },
    phone:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    position:{
        type:String,
        required: false,
    },
    image_url:{
        type:String,
        required:false
    }
});

module.exports=new mongoose.model("employee", EmployeeSchema);