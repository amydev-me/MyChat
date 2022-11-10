const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema=new mongoose.Schema({
    chat_id: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
    },
    sender_id: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
    },
    message:{
        type: String,
        required: true
    },
    file_url:{
        type: String,
        required: false
    },
},{ timestamps: true });

module.exports=new mongoose.model("conversation", ConversationSchema);