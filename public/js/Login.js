'use strict';

formSubmitEvent();


function formSubmitEvent(){
    const form = document.getElementById('login-form');    
    form.addEventListener('submit', onClickedSignIn);

}


function onClickedSignIn(event){
    event.preventDefault();

    
    let credentials = {
        email : document.getElementById('inputEmail').value,
        password : document.getElementById('inputPassword').value
    }
    console.log(credentials)
    axios.post(`/api/login`, credentials).then(({data}) => {
        if(data.role == 'Planner'){
            window.location.href = window.location.origin;
        }else{
            window.location.href = '/';
        }
        // window.location.href = window.location.origin;
    }).catch(error => {
        if(error.response.data){
            displayMessageDialog(error.response.data.message)
        }
        else{
            displayMessageDialog("Failed to login!!")
        }
        
    })
}

function displayMessageDialog(text){
    
    if(document.getElementById('txt-message')){
        
        document.getElementById('txt-message').innerText = text
        $('#message-box').modal('show');
    }
}