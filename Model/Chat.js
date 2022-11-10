const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ChatSchecma=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    is_group:{
        type: Boolean,
        required: true,
        default: false
    }, 
    last_message : {
        type : String,
        required: false
    },
    last_sender : {
        type: Schema.Types.ObjectId, 
        ref: "Employee",
    },
    conversations: [
        {
            type: Schema.Types.ObjectId,
            ref: "Conversation"
        }
    ], 
    employees:[
        {
            type: Schema.Types.ObjectId,
            ref: "Employee"
        }
    ]
},{ timestamps: true });

module.exports = new mongoose.model("Chat", ChatSchecma);