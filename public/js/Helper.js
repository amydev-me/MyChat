'use strict';

/**
 * Get Current week Monday
 */
 function getCurrentWeekMonday(){
    var dt = new Date();
    var days = ((dt.getDay() + 7) - 1) % 7;
    
    return dt.setDate(dt.getDate() - days);
}


function getStatusColor(status){
    switch(status){
        case 'AC' : 
            return 'bg-warning text-white'
        case 'FB' : 
            return 'bg-primary text-white'
        case 'GAS' : 
            return 'bg-success text-white'
        default :
            return 'bg-light text-dark'
    }
}

