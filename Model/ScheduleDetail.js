const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const ScheduleDetailSchecma=new mongoose.Schema({
    shift_1_hk_col_1_staff_id: {
        type: Schema.Types.ObjectId,
        
        ref: "Staff",
    },
    shift_1_hk_col_2_staff_id: {
        type: Schema.Types.ObjectId,
        
        ref: "Staff",
    },
    shift_1_hk_col_3_staff_id: {
        type: Schema.Types.ObjectId,
        
        ref: "Staff",
    },

    shift_2_hk_col_1_staff_id: {
        type: Schema.Types.ObjectId,
        
        ref: "Staff",
    },
    shift_2_hk_col_2_staff_id: {
        type: Schema.Types.ObjectId,
        
        ref: "Staff",
    },
    shift_2_hk_col_3_staff_id: {
        type: Schema.Types.ObjectId,
        
        ref: "Staff",
    },

    shift_1_cp_col_1_staff_id: {
        type: Schema.Types.ObjectId,
        
        ref: "Staff",
    },
    shift_1_cp_col_2_staff_id: {
        type: Schema.Types.ObjectId,
        
        ref: "Staff",
    },
    shift_1_cp_col_3_staff_id: {
        type: Schema.Types.ObjectId,
        
        ref: "Staff",
    },

    shift_2_cp_col_1_staff_id: {
        type: Schema.Types.ObjectId,
        
        ref: "Staff",
    },
    shift_2_cp_col_2_staff_id: {
        type: Schema.Types.ObjectId,
        
        ref: "Staff",
    },
    shift_2_cp_col_3_staff_id: {
        type: Schema.Types.ObjectId,
        
        ref: "Staff",
    },
    day_name : {
        type : String,
        required : true
    }
});

module.exports=new mongoose.model("ScheduleDetail", ScheduleDetailSchecma);