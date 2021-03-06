var pastecontent;
function getRandomPassword(){
    return CryptoJS.lib.WordArray.random(24).toString(CryptoJS.enc.Base64).replace("+","_");
}

function getContentEncrypted(password, content){
    return CryptoJS.AES.encrypt(content,password + '' );
}

function decryptContent(c,pw) {
    return CryptoJS.AES.decrypt(c,pw);
}

function pasteIt(){
    var pass = getRandomPassword();
    var ulbox = document.getElementById('filef');
    var f = ulbox.files[0];
    if(f){
        readSingleFile(ulbox, function(data){
            if(!isImage(data)){
                alert("Invalid file selected, use jpg, png or gif.");
            }
            var enccontent = getContentEncrypted(pass, data);
            uploadContent(enccontent, pass);
        });
    } else {
        var enccontent = getContentEncrypted(pass, $('#r').val());
        uploadContent(enccontent, pass);
    }
}

function uploadContent(enccontent, pass){

$.post('/store', {r:enccontent+''}, function(data) {
        var res = data.split(/:/);
        if(res[0]=="OK"){
            $('#r').val("");
            window.location.hash = "#" + res[1] + ":" + pass;
        }
    });
}

function findBaseURL(){
    return (window.location+'').split(/#/)[0];
}

function getBin(id,password) {
    $.get("/get/" + id, function(data){
        data = decryptContent(data,password).toString(CryptoJS.enc.Utf8);
        showBin(data);
    });
}

function showBin(c) {
    var t = findImgType(c);
    $(".prettyprint").empty();
    $("#paster").hide();
    $("#download").show();
    $("#newpaste").show();
    if(t !== false) {
        var img = "data:image/"+t+";base64," + btoa(c);
        $(".prettyprint").append('<img id="pasteImg"></img>');
        $("#pasteImg").attr('src',img);
        $("pre,img").show();
        //return;
    } else {
        $(".prettyprint").append('<code id="paste"></code>');
        $("#paste").text(c);
        $("code,pre").show();
        prettyPrint();
    }
    pastecontent=c;
}

function downloadPaste() {
    window.location = 'data:text/plain,' + escape(pastecontent);
}

function readSingleFile(uploadbox, cb) {
    var f = uploadbox.files[0];
    var r = new FileReader();
    r.onload = function(e) {
        var contents = e.target.result;
        cb(contents);
    }
    r.readAsBinaryString(f);
}

function isImage(data){
    return findImgType(data) !== false;
}

function findImgType(data){
    var imageHeaders = ["89504e470d0a1a0a", "png",
                        "ffd8", "jpg",
                        "474946383761", "gif",
                        "474946383961", "gif"];

    for(var i=0; i < imageHeaders.length; i+=2){
        var binHeader = hex2bin(imageHeaders[i]);
        if(data.substr(0, binHeader.length) == binHeader) {
            return imageHeaders[i+1];
        }
    }
    return false;
}

function hex2bin(hex){
    console.log(hex);
    var bytes=[];
    for(var i=0; i< hex.length-1; i+=2){
            bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return String.fromCharCode.apply(String, bytes);
}

function initPage(){
    var url=window.location+'';
    if(url.indexOf("#") != -1){
        var d = url.split("#")[1].split(":");
        if(d.length == 2){
            getBin(d[0],d[1]);
        }
    }else{
        $("#paster").show();
        $("#download").hide();
        $("#newpaste").hide();
	$("pre").hide();
    }
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert("Your browser doesn't support File API's. Image upload won't work. I suggest upgrading to Google Chrome.");
    }
}

$(document).ready(initPage);
$(window).on('hashchange', initPage);
