'use strict';



function loadUi(){
    let myTableDiv = document.getElementById("schedule");
      
    let table = document.createElement('table');
    table.className="table table-bordered text-center";
    
    let thead = document.createElement('thead');

    let th = document.createElement("th");
    th.innerText = "";
    th.colSpan = 2;
    thead.appendChild(th)
    table.appendChild(thead)

    
    th = document.createElement("th");
    th.innerText = "Housekeeping(AC)";
    th.colSpan = 3;
    thead.appendChild(th)
    table.appendChild(thead)

    th = document.createElement("th");
    th.innerText = "F & B (Captain)";
    th.colSpan = 3;
    thead.appendChild(th)
    table.appendChild(thead)


    let tableBody = document.createElement('tbody');
    table.appendChild(tableBody);

    for(let i = 0; i <= 6 ; i++){
        for(let row = 1; row <=2 ; row++){
            let tr = document.createElement('tr');
            let divCol = document.createElement("div");
            tableBody.appendChild(tr);

            let td = document.createElement('td');
            if(row == 1){
                td.className="align-middle table-column"
                td.rowSpan = 2;
                divCol.innerHTML = DAYS[i];
                td.appendChild(divCol);
                tr.appendChild(td);
            }

            td = document.createElement('td');
            td.className="align-middle table-column"
            divCol = document.createElement("div");
            divCol.innerHTML = `Shift-${row}`;
            td.appendChild(divCol);
            tr.appendChild(td);

            createDutyAssignCol(tr, DAYS[i], HOUSE_KEEPING, row);
            createDutyAssignCol(tr, DAYS[i], CAPTAIN, row);
        }
        
    }
    myTableDiv.appendChild(table);
}

function createDutyAssignCol(parentRow, day, type, row){
    for (let col=1; col <= 3; col++){
        let td = document.createElement('td');
      
        let isDraggable = false;
        if( type == HOUSE_KEEPING){
           isDraggable = (col == 1 || col == 2);
        }
        if( type == CAPTAIN){
            isDraggable = (col == 1);
        }

        
        let dbColName = `shift_${row}_${type}_col_${col}_staff_id`;
        let column_id =`shift-${row}-${type}-${day}-col-${col}`;
        let task = tasks.find(e => e.day_name == day);
        let assign = Object.create( {} );

        // debugger;
        assign.column_id = column_id;
        assign.db_col_name = dbColName;
        assign.type = type;
        assign.staff_name = task[dbColName] ? task[dbColName].name : (isDraggable?'+' : null);
        assign.status = task[dbColName] ? task[dbColName].status : null;
        assign.draggable = isDraggable;
        assign.day_name = day;     
        assign.id = task._id;  

        let divCol = document.createElement("div");
        
         if(isDraggable && task[dbColName] && !schedule.is_published && schedule.is_active){
            let btn = document.createElement("button");
            btn.type = "button";
            btn.className = "close";          
            btn.addEventListener('click', function(){
                onClickedDelete(assign)
            });
            let icon = document.createElement('span');
            icon.innerHTML = "&times;"  
            btn.appendChild(icon)
            td.appendChild(btn);
       
        }else{
            divCol.className = "table-column"
            divCol.innerHTML = null;
            td.appendChild(divCol);
            parentRow.appendChild(td);
        }
        divCol.className = "table-column pt-3 " + getStatusColor(assign.status) + ((isDraggable && !task[dbColName] && !schedule.is_published && schedule.is_active) ? ' cursor-pointer' : '')
        divCol.innerHTML = assign.staff_name;
        divCol.id =column_id;       

        if(!schedule.is_published && schedule.is_active){
            divCol.draggable =  true;
            divCol.addEventListener('dragstart', onDragStart)
            divCol.addEventListener('dragenter', onDragEnter)
            divCol.addEventListener('dragover', onDragOver)
            divCol.addEventListener('dragleave', onDragLeave)
            divCol.addEventListener('drop', onDragDrop)
            divCol.dataset.data = JSON.stringify(assign);
        }
        td.appendChild(divCol);
        parentRow.appendChild(td);
    }
}

function onDragStart(e){ 
    if(schedule.is_published){
        displayMessageDialog("Can't modify this schedule already published.");
    }
    if(!JSON.parse(e.target.dataset.data).draggable){
        displayMessageDialog("Currently Not available to assign this shift.");
        e.preventDefault();
    }
    e.dataTransfer.setData("application/json", e.target.dataset.data);   
    e.dataTransfer.setData("Text", JSON.parse(e.target.dataset.data).column_id);
    e.dataTransfer.effectAllowed = 'move';
}

function getAssignTaskByDayname(day){
    return tasks.find(e=> e.day_name == day);
}

function checkStaffAssignByDay(day, staff_id, p_tasks){
    let task = p_tasks.find(e=> e.day_name == day);
    
    for(let col in task){          
        if(task[col]){
            if(task[col]._id == staff_id){
               return true;
            }
        }
    }
    return false;
}
/**
* Validate Rest Day
*
* Monday
* Check Tue and Wed

* Tuesday
* Check Monday && Wed
* Check Wed && Thursday

* Wedsday
* Check Tue & Thur
* Check Monday & The
* Check Thur & Fri

* Thursday
* Check Wed & Fri
* Check Tue & Wed
* Check Friday & Sat

* Friday
* Check Thur & Sat
* Check Wed & Thur
* Check Sat & Sun

* Sat
* Check Fri & Sun
* Check Thur & Fri

* Sun
* Check Sat & Fri
*/
function checkIsStaffRestDay(target_day, staff_id, cloneTasks){
    let alreadyAssignInMon = checkStaffAssignByDay(DAYS[0], staff_id, cloneTasks);
    let alreadyAssignInTue = checkStaffAssignByDay(DAYS[1], staff_id, cloneTasks);
    let alreadyAssignInWed = checkStaffAssignByDay(DAYS[2], staff_id, cloneTasks);
    let alreadyAssignInThur = checkStaffAssignByDay(DAYS[3], staff_id, cloneTasks);
    let alreadyAssignInFri = checkStaffAssignByDay(DAYS[4], staff_id, cloneTasks);
    let alreadyAssignInSat = checkStaffAssignByDay(DAYS[5], staff_id, cloneTasks);
    let alreadyAssignInSun = checkStaffAssignByDay(DAYS[6], staff_id, cloneTasks);
    
    //Monday
    // Check T and W
    if(target_day == DAYS[0]){           
  
        if(alreadyAssignInTue && alreadyAssignInWed){
           
            return true;
        }
    }
    // Tuesday
    // Monday && Wed
    // Wed && Thursday
    else if(target_day == DAYS[1]){        
        if((alreadyAssignInMon &&  alreadyAssignInWed) || (alreadyAssignInWed &&  alreadyAssignInThur)){
            return true;
        }
    }
    // Wedsday
    // Tue & Thur
    // Monday & The
    // Thur & Fri
    else if(target_day == DAYS[2]){
        
        if((alreadyAssignInTue &&  alreadyAssignInThur) || (alreadyAssignInMon &&  alreadyAssignInTue) || (alreadyAssignInThur &&  alreadyAssignInFri)){
            return true;
        }
    }
    //Thursday
    // Wed & Fri
    // Tue & Wed
    // Friday & Sat
    else if(target_day == DAYS[3]){
        if((alreadyAssignInWed &&  alreadyAssignInFri) || (alreadyAssignInTue &&  alreadyAssignInWed) || (alreadyAssignInFri &&  alreadyAssignInSat)){
            return true;
        }
    }
    //Friday
    // Thur & Sat
    // Wed & Thur
    // Sat & Sun
    else if(target_day == DAYS[4]){
        if((alreadyAssignInWed &&  alreadyAssignInThur) || (alreadyAssignInWed &&  alreadyAssignInThur) || (alreadyAssignInSat &&  alreadyAssignInSun)){
            return true;
        }
    }
    //Sat
    // Fri & Sun
    // Thur & Fri
    else if(target_day == DAYS[5]){
        if((alreadyAssignInFri &&  alreadyAssignInSun) || (alreadyAssignInThur &&  alreadyAssignInFri)){
            return true;
        }
    }
    //Sun
    // Sat & Fri
    else if(target_day == DAYS[6]){
        if((alreadyAssignInSat &&  alreadyAssignInFri)){
            return true;
        }
    }
    return false;
}

function onDragDrop(ev){
    ev.preventDefault();
    const targetData = ev.target.dataset.data;
    const targetDiv = JSON.parse(targetData);
    if(!targetDiv.draggable){ displayMessageDialog("Currently Not available to assign this shift."); return;}

   
    let targetTask = tasks.find(e => e.day_name == targetDiv.day_name);
    let targetTaskIndex = tasks.findIndex(e => e.day_name == targetDiv.day_name);
   
    let userObjString = ev.dataTransfer.getData("application/user");
    if(userObjString){
        const staff =  JSON.parse(ev.dataTransfer.getData("application/user"));   

        if(staff.status == 'FB' && targetDiv.type == HOUSE_KEEPING ){          
            displayMessageDialog("Staff can't assign in House Keeping (Amenity Center)!");
            return;
        }

        if(staff.status == 'AC' && targetDiv.type == CAPTAIN ){    
            displayMessageDialog("Staff can't assign in F&B (Captain)!");      
            return;
        }


        /**
         * Validate Staff assgin on the same day
         
        */
        let isSameDay = checkStaffAssignByDay(targetDiv.day_name, staff._id, tasks);
        if(isSameDay){
            displayMessageDialog("Can't assign staff in the same day!!!");      
            return;
        }

        let isRestDay = checkIsStaffRestDay(targetDiv.day_name, staff._id, tasks)

        if(isRestDay){
            displayMessageDialog(staff.name + " can't work more than 2 consequences day!");
            return;
        }
        tasks[targetTaskIndex][targetDiv.db_col_name] = { _id : staff._id, name : staff.name, status : staff.status};
    }
    else
    {
    
        const fromTaskObj =  JSON.parse(ev.dataTransfer.getData("application/json"));

        if((fromTaskObj.status == 'FB' && targetDiv.type == HOUSE_KEEPING)){          
            displayMessageDialog("Staff can't assign in House Keeping (Amenity Center)!");
            return;
        }else if((fromTaskObj.status == 'AC' && targetDiv.type == CAPTAIN )){          
            displayMessageDialog("Staff can't assign in F&B (Captain)!");
            return;
        }

        if((targetDiv.status == 'FB' && fromTaskObj.type == HOUSE_KEEPING) ){          
            displayMessageDialog("Staff can't assign in House Keeping (Amenity Center)!");
            return;
        }else if(targetDiv.status == 'AC' && fromTaskObj.type == CAPTAIN ){          
            displayMessageDialog("Staff can't assign in F&B (Captain)!");
            return;
        }
        
       
        let cloneTasks = _.cloneDeep(tasks)

        let fromTask = tasks.find(e=> e.day_name == fromTaskObj.day_name);
        let fromTaskIndex = tasks.findIndex(e=> e.day_name == fromTaskObj.day_name);    
       
        let cloneStaffId = fromTask[fromTaskObj.db_col_name];
        let cloneTargetData = targetTask[targetDiv.db_col_name];

        cloneTasks[fromTaskIndex][fromTaskObj.db_col_name] = cloneTargetData;
        cloneTasks[targetTaskIndex][targetDiv.db_col_name] = cloneStaffId;
        
        if(fromTask.day_name != targetDiv.day_name){
            if( targetTask[targetDiv.db_col_name]){
            
                let isSameDay = checkStaffAssignByDay(fromTaskObj.day_name,targetTask[targetDiv.db_col_name]._id, tasks);
                if(isSameDay){                    
                    displayMessageDialog("Can't assign staff in the same day!!!");
                    return;
                }
                
              
                let fromRestDay = checkIsStaffRestDay(fromTaskObj.day_name, targetTask[targetDiv.db_col_name]._id, cloneTasks )
                if(fromRestDay){
                    displayMessageDialog(targetTask[targetDiv.db_col_name].name + " can't work more than 2 consequences day!");
                    return;
                }
            }
      
            if(fromTask[fromTaskObj.db_col_name]){
                let isSameDay = checkStaffAssignByDay(targetDiv.day_name, fromTask[fromTaskObj.db_col_name]._id, tasks);
                if(isSameDay){
                    displayMessageDialog("Can't assign staff in the same day!!!");
                    return;
                }

                let toRestDay = checkIsStaffRestDay(targetDiv.day_name, fromTask[fromTaskObj.db_col_name]._id, cloneTasks)
                if(toRestDay) {
                    displayMessageDialog(fromTask[fromTaskObj.db_col_name].name + " can't work more than 2 consequences day!");
                    return;
                }
            }
        }
        tasks[fromTaskIndex][fromTaskObj.db_col_name] = cloneTargetData;
        tasks[targetTaskIndex][targetDiv.db_col_name] = cloneStaffId;
    }
    removeAllElement();
    loadUi();
}
function onDragEnter(e){
    e.preventDefault();
}

function onDragOver(e){
    e.preventDefault();
}

function onDragLeave(e){
    e.preventDefault();
}
function removeAllElement(){
    /**
  * Remove all main child element
  * */
    const myNode = document.getElementById("schedule");
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild);
    }
}