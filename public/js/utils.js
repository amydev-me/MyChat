'use strict';



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
function createSelectVersion(){
    var selectList = document.getElementById("versions-list");
    //Create and append the options
    for (var i = 0, count = versions.length; i < count; i++) {
        selectList.options[selectList.options.length] = new Option(versions[i], versions[i]);
    }
}

function displayMessageDialog(text){
    
    if(document.getElementById('txt-message')){
        
        document.getElementById('txt-message').innerText = text
        $('#message-box').modal('show');
    }
}