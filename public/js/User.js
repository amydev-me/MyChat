'use strict';

let users = []
loadUsers();

function loadUsers(){
    axios.get(`/api/get-staffs`).then(({data}) => {
        users = data.items;
        createUserListView();
    }).catch(error => {
        console.log(error)
    })
}

function createUserListView(){
    for(let i = 0, count = users.length; i < count; i++){
        let userDiv = document.createElement("div");
        userDiv.id= `user_${users[i].id}`;
        userDiv.className = "list-group-item " + getStatusColor(users[i].status);
             
        userDiv.draggable =  true;
        userDiv.dataset.data = JSON.stringify(users[i]);
        userDiv.addEventListener('dragstart', onDragStartUser)
        userDiv.innerHTML = users[i].name;
        document.getElementById('users').appendChild(userDiv);
    }
}


function onDragStartUser(e){
    if(schedule.is_published){alert("Can't modify this schedule already published.")}
    e.dataTransfer.setData("application/user", e.target.dataset.data);
    e.dataTransfer.effectAllowed = 'move';
}

async function onSubmitNewStaff(event){
    event.preventDefault();
    let data = new Object;
    data.name =  event.target['txt-staff-name'].value;
    data.postal_code =  event.target['txt-postalcode'].value;
    data.unit_no = event.target['txt-unitno'].value;
    data.street_name =  event.target['txt-address'].value;
    data.status =  event.target['status-list'].value;
    data.email =  event.target['txt-email'].value;
    data.password =  event.target['txt-password'].value;
    data.phone =  event.target['txt-phone'].value;
    data.role = 'Staff';
    axios.post(`/api/create-staff`, data).then(({data}) => {
        users = data.items;
        removeAllUserElement();
        createUserListView();
        $('#exampleModalCenter').modal('hide');
        clearForm(event);
    }).catch(error => {
    })
}

function clearForm(event){
    event.target['txt-staff-name'].value = '';
    event.target['txt-postalcode'].value = '';
    event.target['txt-unitno'].value = '';
    event.target['txt-address'].value = '';
    event.target['status-list'].value = 'NA';
}

function removeAllUserElement(){
    /**
  * Remove all main child element
  * */
    const myNode = document.getElementById("users");
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild);
    }
}