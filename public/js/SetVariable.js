'use strict'
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOUSE_KEEPING = 'hk';
const CAPTAIN = 'cp';
let tasks = [];
let versions = [];
let emptyTasks =   [
    {
        id : null,        
        shift_1_hk_col_1_staff_id : null,
        shift_1_hk_col_2_staff_id : null,
        shift_1_hk_col_3_staff_id : null,

        shift_2_hk_col_1_staff_id : null,
        shift_2_hk_col_2_staff_id : null,
        shift_2_hk_col_3_staff_id : null,
       
        shift_1_cp_col_1_staff_id : null,
        shift_1_cp_col_2_staff_id : null,
        shift_1_cp_col_3_staff_id : null,

        shift_2_cp_col_1_staff_id : null,
        shift_2_cp_col_2_staff_id : null,
        shift_2_cp_col_3_staff_id : null,
        created_at : null,
        updated_at : null,
        day_name : "Monday"
    },
    {
        id : null,        
        shift_1_hk_col_1_staff_id : null,
        shift_1_hk_col_2_staff_id : null,
        shift_1_hk_col_3_staff_id : null,

        shift_2_hk_col_1_staff_id : null,
        shift_2_hk_col_2_staff_id : null,
        shift_2_hk_col_3_staff_id : null,
       
        shift_1_cp_col_1_staff_id : null,
        shift_1_cp_col_2_staff_id : null,
        shift_1_cp_col_3_staff_id : null,

        shift_2_cp_col_1_staff_id : null,
        shift_2_cp_col_2_staff_id : null,
        shift_2_cp_col_3_staff_id : null,
        created_at : null,
        updated_at : null,
        day_name : "Tuesday"
    },
    {
        id : null,        
        shift_1_hk_col_1_staff_id : null,
        shift_1_hk_col_2_staff_id : null,
        shift_1_hk_col_3_staff_id : null,

        shift_2_hk_col_1_staff_id : null,
        shift_2_hk_col_2_staff_id : null,
        shift_2_hk_col_3_staff_id : null,
       
        shift_1_cp_col_1_staff_id : null,
        shift_1_cp_col_2_staff_id : null,
        shift_1_cp_col_3_staff_id : null,

        shift_2_cp_col_1_staff_id : null,
        shift_2_cp_col_2_staff_id : null,
        shift_2_cp_col_3_staff_id : null,
        created_at : null,
        updated_at : null,
        day_name : "Wednesday"
    },
    {
        id : null,        
        shift_1_hk_col_1_staff_id : null,
        shift_1_hk_col_2_staff_id : null,
        shift_1_hk_col_3_staff_id : null,

        shift_2_hk_col_1_staff_id : null,
        shift_2_hk_col_2_staff_id : null,
        shift_2_hk_col_3_staff_id : null,
       
        shift_1_cp_col_1_staff_id : null,
        shift_1_cp_col_2_staff_id : null,
        shift_1_cp_col_3_staff_id : null,

        shift_2_cp_col_1_staff_id : null,
        shift_2_cp_col_2_staff_id : null,
        shift_2_cp_col_3_staff_id : null,
        created_at : null,
        updated_at : null,
        day_name : "Thursday"
    },
    {
        id : null,        
        shift_1_hk_col_1_staff_id : null,
        shift_1_hk_col_2_staff_id : null,
        shift_1_hk_col_3_staff_id : null,

        shift_2_hk_col_1_staff_id : null,
        shift_2_hk_col_2_staff_id : null,
        shift_2_hk_col_3_staff_id : null,
       
        shift_1_cp_col_1_staff_id : null,
        shift_1_cp_col_2_staff_id : null,
        shift_1_cp_col_3_staff_id : null,

        shift_2_cp_col_1_staff_id : null,
        shift_2_cp_col_2_staff_id : null,
        shift_2_cp_col_3_staff_id : null,
        created_at : null,
        updated_at : null,
        day_name : "Friday"
    },
    {
        id : null,        
        shift_1_hk_col_1_staff_id : null,
        shift_1_hk_col_2_staff_id : null,
        shift_1_hk_col_3_staff_id : null,

        shift_2_hk_col_1_staff_id : null,
        shift_2_hk_col_2_staff_id : null,
        shift_2_hk_col_3_staff_id : null,
       
        shift_1_cp_col_1_staff_id : null,
        shift_1_cp_col_2_staff_id : null,
        shift_1_cp_col_3_staff_id : null,

        shift_2_cp_col_1_staff_id : null,
        shift_2_cp_col_2_staff_id : null,
        shift_2_cp_col_3_staff_id : null,
        created_at : null,
        updated_at : null,
        day_name : "Saturday"
    },
    {
        id : null,        
        shift_1_hk_col_1_staff_id : null,
        shift_1_hk_col_2_staff_id : null,
        shift_1_hk_col_3_staff_id : null,

        shift_2_hk_col_1_staff_id : null,
        shift_2_hk_col_2_staff_id : null,
        shift_2_hk_col_3_staff_id : null,
       
        shift_1_cp_col_1_staff_id : null,
        shift_1_cp_col_2_staff_id : null,
        shift_1_cp_col_3_staff_id : null,

        shift_2_cp_col_1_staff_id : null,
        shift_2_cp_col_2_staff_id : null,
        shift_2_cp_col_3_staff_id : null,
        created_at : null,
        updated_at : null,
        day_name : "Sunday"
    }
];
let emptyObject = null;
let schedule =  {
    _id : null,
    starting_week_date : null,
    version_no : 1,
    is_published : false,
    is_active : false
}