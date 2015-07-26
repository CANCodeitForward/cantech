// User Login
$('#user-login').submit(function() {
    var data = $('#user-login').serialize();
        $.ajax({ 
            url: '/login_user'
          , type: 'POST'
          , data: data
          , complete: function() {
          },
    
          success: function(resData) {
                window.location.replace("/");
           },
    
          error: function(error) {
            var response;
                if (error.status) {
                  console.log(error);
                    response = "Invalid username or password!";
                } else {
                    response = JSON.parse(error.responseText.message);
                }
                $('.login-messages').html(response); 
                $('.login-messages').show(); 
           },
        });
          
    return false;

});