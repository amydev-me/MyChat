'use strict';
loadData();
function loadData(){
    axios.get(`/api/get-puslished-schedule`).then(({data}) => {
        if(data.schedule){

            schedule.version_no = data.schedule.version_no;
            schedule._id = data.schedule._id;
            schedule.starting_week_date = data.schedule.starting_week_date;
            schedule.is_published = data.schedule.is_published;
            schedule.is_active = data.schedule.is_active;
            tasks = data.schedule.details;
            versions = data.versions;

            $(".date").datepicker("update",  schedule.starting_week_date);
           
             
      
          
        }else{
            let _monday =  moment(getCurrentWeekMonday()).format('DD/MM/YYYY');
            schedule.version_no = 1;
            schedule._id = null;
            schedule.starting_week_date = _monday;
            schedule.is_published = true;
            schedule.is_active = true;
            $(".date").datepicker("update", _monday);
            tasks = emptyTasks;
        }
        loadUi();
    }).catch(error => {
        console.log(error)
    })
}



function onClickedSearch(){

    let starting_week_date = $('#datetimepicker1').datepicker('getFormattedDate', 'dd/mm/yyyy');
    
    axios.get(`/api/get-published-schedule-by-filter`, {
        params : {
            starting_week_date
        }
    }).then(({data}) => {
        if(data.schedule){

            schedule.version_no = data.schedule.version_no;
            schedule._id = data.schedule._id;
            schedule.starting_week_date = data.schedule.starting_week_date;
            schedule.is_published = data.schedule.is_published;
            schedule.is_active = data.schedule.is_active;
            tasks = data.schedule.details;          
        }else{
            schedule.version_no = 1;
            schedule._id = null;
            schedule.starting_week_date = $('#datetimepicker1').datepicker('getFormattedDate', 'dd/mm/yyyy');
            schedule.is_published = true;
            schedule.is_active = true;
            tasks = emptyTasks;
        }
        removeAllElement();
        loadUi();
    }).catch(error => {
        console.log(error)
    })
}

function onSelectedDateChange(){
    onClickedSearch()
}