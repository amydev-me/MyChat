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
    details: [
        {
            type: Schema.Types.ObjectId,
            ref: "Participants"
        }
    ]
},{ timestamps: true });

module.exports = new mongoose.model("Chat", ChatSchecma);