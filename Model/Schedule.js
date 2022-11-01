const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ScheduleSchecma=new mongoose.Schema({
    starting_week_date:{
        type: String,
        required: true
    },
    is_published:{
        type: Boolean,
        required: true,
        default: false
    },
    version_no :{
        type : Number,
        required : true,
        default:1
    },
    is_active :{
        type : Boolean,
        required : true,
        default:false
    },
    details: [
        {
            type: Schema.Types.ObjectId,
            ref: "ScheduleDetail"
        }
    ]
},{ timestamps: true });

module.exports = new mongoose.model("Schedule", ScheduleSchecma);