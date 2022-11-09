'use strict';
loadData();

function viewMode(viewMode){
    let btnSave = document.getElementById("btn-save");
    let btnPublish = document.getElementById("btn-publish");
    btnSave.style.display = viewMode?'none' :'inline';
    btnPublish.style.display = viewMode?'none' :'inline';
}

function showVersion(mode){
    let col = document.getElementById("version-col");
    col.style.display = mode ? 'block' : 'none';
}
function clearVersions(){
    let select = document.getElementById("versions-list");
    select.options.length = 0;
}
function loadData(){
    axios.get(`/api/get-schedule`).then(({data}) => {
        if(data.schedule){

            schedule.version_no = data.schedule.version_no;
            schedule._id = data.schedule._id;
            schedule.starting_week_date = data.schedule.starting_week_date;
            schedule.is_published = data.schedule.is_published;
            schedule.is_active = data.schedule.is_active;
            tasks = data.schedule.details;
            versions = data.versions;

            $(".date").datepicker("update",  schedule.starting_week_date);
            if((schedule.is_published && schedule.is_active)){
                viewMode(true);
                showVersion(false);
            }
            else if(!schedule.is_published && !schedule.is_active){
                viewMode(true);
                showVersion(true);
            }
            else{
                showVersion(true);
                viewMode(false);                
                createSelectVersion();
            }
          
        }else{
            let _monday =  moment(getCurrentWeekMonday()).format('DD/MM/YYYY');
            schedule.version_no = 1;
            schedule._id = null;
            schedule.starting_week_date = _monday;
            schedule.is_published = false;
            schedule.is_active = true;
            $(".date").datepicker("update", _monday);
            showVersion(false);
            viewMode(false);
            tasks = emptyTasks;
        }
        loadUi();
    }).catch(error => {
        console.log(error)
    })
}

function onClickedSave(){
    
   
    axios.post(`/api/save-schedule`, {
        is_active: true,
        starting_week_date : $("#datetimepicker1").find("input").val(),
        items : JSON.stringify(tasks),
        details : []
    }).then(({data}) => {
        onClickedSearch();
    }).catch(error => {

    })
}

function onClickedPublish(){
    
    axios.post(`/api/publish-schedule`, {
        starting_week_date : schedule.starting_week_date,
        version_no : schedule.version_no,
        _id : schedule._id
    }).then(({data}) => {
        loadData();
    }).catch(error => {

    })
}

function onClickedSearch(version_no){

    let starting_week_date = $('#datetimepicker1').datepicker('getFormattedDate', 'dd/mm/yyyy');
    
    axios.get(`/api/get-schedule-by-filter`, {
        params : {
            starting_week_date ,
            version_no
        }
    }).then(({data}) => {
        if(data.schedule){

            schedule.version_no = data.schedule.version_no;
            schedule._id = data.schedule._id;
            schedule.starting_week_date = data.schedule.starting_week_date;
            schedule.is_published = data.schedule.is_published;
            schedule.is_active = data.schedule.is_active;
            tasks = data.schedule.details;
            versions = data.versions;
            if((schedule.is_published && schedule.is_active)){
                viewMode(true);
                showVersion(false);
            }
            else if(!schedule.is_published && !schedule.is_active){
                viewMode(true);

            }else{
                showVersion(true);
                viewMode(false);  
            }
            clearVersions();
            createSelectVersion();

            let element = document.getElementById('versions-list');
            element.value = data.schedule.version_no;
          
        }else{
            schedule.version_no = 1;
            schedule._id = null;
            schedule.starting_week_date = $('#datetimepicker1').datepicker('getFormattedDate', 'dd/mm/yyyy');
            schedule.is_published = false;
            schedule.is_active = true;
            
            showVersion(false);
            viewMode(false);
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
function onSelectedVersionChange(){
    let version_no = document.getElementById("versions-list").value;
    onClickedSearch(version_no)
}

function onClickedDelete(para){
    emptyObject =para;
    $('#confirm-delete').modal('show');
}

$('#confirm-yes').on('click', function(event) {
    event.preventDefault(); 
    $('#confirm-delete').modal('hide');
    let taskIndex = tasks.findIndex(e => e._id == emptyObject.id);
    tasks[taskIndex][emptyObject.db_col_name] = null;
    removeAllElement();
    loadUi();
});

