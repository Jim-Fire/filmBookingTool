const app = {
    redirectDelay: 300,
    requestTimeOut: 30000,
    jwt:'',
    row:30,
    col:40
};
$(document).ready(function(){
    app.jwt = localStorage.getItem(
        "jwt_token"
    );

    $('#sign-up').click(function(e){
        e.preventDefault();
        if($('#inputPassword').val()!==$('#confirmInputPassword').val()){
            mainAlert('danger','Confirm your password!');
        }
        const fields = {
            email: $('#inputEmail').val(),
            password: $('#inputPassword').val(),
        };
        if(!fields.email || !fields.password){
            mainAlert('danger','Pls, enter email and password fields!');
        }
        console.log(fields);
        request('post','register',fields,function(res){
            if(res.success){
                setTimeout(()=>{
                    location.replace('/');
                },app.redirectDelay);
                
            }
            console.log('res',res)
        });
    });

    $('#sign-in').click(function(e){
        e.preventDefault();
        const fields = {
            email: $('#inputEmail').val(),
            password: $('#inputPassword').val(),
        };
        if(!fields.email || !fields.password){
            mainAlert('danger','Pls, enter email and password fields!');
        }
        console.log(fields);
        request('post','auth/sign-in',fields,function(res){
            if(res.success){
                localStorage.setItem('jwt_token', res.token);
                app.jwt = localStorage.getItem(
                    "jwt_token"
                );
                setTimeout(()=>{
                    location.replace('/album');
                },app.redirectDelay);
                
            }
            console.log('res',res)
        });
    });

    $('.btn-group.seans > button').click(function(e){
        const row = parseInt($('#row-select').val());
        const col = parseInt($('#col-select').val());
        if(!row || !col){
            mainAlert('danger','Select row and column!');
        }
        const className = $(this).hasClass('btn-seans-buy')?'buy':$(this).hasClass('btn-seans-reserve')?'reserve':'cancel';
        const id = $('.btn-group.seans').attr('data-id');
        let status=0;
        switch(className){
            case 'buy'    : status=2;break;
            case 'reserve': status=1;break;
            case 'cancel' : status=0;break;
            default: mainAlert('danger','Script error. </br> Check console');console.log(e,className,this)
        }
        request('post','change-ticket-status',{ id: id, row: row, col: col, status: status },function(res){
            console.log(res)
        });
    });
});

function request(type, url, params, callback) {
    console.log('');
    console.log(' /--////--Start AJAX request info--////---');
    console.log('| req type: ', type);
    console.log('| req url:', url);
    console.log('| req params', params);
    console.log(' \\--////--End AJAX request info--////---');
    console.log('');
    $.ajax({
        url:url,
        type:type.toUpperCase(),
        data:JSON.stringify(params),
        contentType:"application/json",
        dataType:"json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'jwt '+ app.jwt);
        },
        success: function (res) {
            if(res.token){
                app.jwt = res.token;
                console.log('Received new jwt token',res.token)
            }
            if(res.success){
                mainAlert('success',res.success);
            }
            if(res.warning){
                mainAlert('warning',res.warning);
            }
            if(res.error){
                mainAlert('danger','Rejection error: '+res.error);
            }
            callback(res);
        },
        timeout: app.requestTimeOut,
        error:function (res) {
            if(res.error){
                mainAlert('danger','Server Error: '+ res.error);
            }else{
                mainAlert('danger','Unknown error. </br> Check internet connection and reload page');
            }
            console.log("Received error response:",res)
        }
    });
}//basic request template
function mainAlert(type,message,callback)  {//type: danger, info, warning, success
    var mainAlert = $('#main-alert').css({
        display:'flex'
    });
    var typeClass = 'alert-'+type;
    var divAlert = $('<div class="main-alert alert danger alert-dismissible"></div>').addClass(typeClass);
    var divBtnClose = $('<button type="button" class="close alert-close" data-dismiss="alert" aria-hidden="true">×</button>');
    $(divBtnClose).click(function (e) {
        $(divAlert).remove();
        //console.log('length :',$('#main-alert div.main-alert').length);
        if($('#main-alert div.main-alert').length<=1){
            $(mainAlert).hide();
        }
    });
    if(type==='danger'){type = 'Error'}
    var h4 = $('<h4></h4>').html(type);
    var info = $('<div></div>').html(message);
    divAlert.append(divBtnClose).append(h4).append(info);
    if(!!callback){
        $(mainAlert).empty();
        var buttons = $('<div class="alert-buttons" ><button type="button" class="alert-ok btn btn-block btn-success">Okay</button><button type="button" class="alert-cancel btn btn-block btn-danger">Cancel</button></div>');
        divAlert.append(buttons);
        $(mainAlert).addClass('centered');
    }else {
        $(mainAlert).removeClass('centered');
    }
    mainAlert.append(divAlert);
    if(!!callback){
        $('.alert-cancel').click(function (e) {
            $(divBtnClose).trigger('click');
        });
        $('.alert-ok').click(function (e) {
            callback(e);
            $(divBtnClose).trigger('click');
        });
    }else{
        setTimeout(()=>{
            $(divBtnClose).trigger('click');
        },3000)
    }
}