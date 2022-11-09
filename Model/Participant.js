const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const ParticipantsSchema=new mongoose.Schema({
    chat_id: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
    },
    employee_id: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
    },
});

module.exports=new mongoose.model("participant", ParticipantsSchema);