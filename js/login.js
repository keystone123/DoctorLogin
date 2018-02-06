function onLogout() {
    window.location = "index.html";
}


$('#submit').click(function(e) {


    e.preventDefault(); // cancel submission

    var user = $('#username').val();
    var pwd = $("#password").val();

    sessionStorage.setItem('userid', "" + user + "");
    if (user == "" || pwd == "") //required username and password
    {
        document.getElementById('spnerror').innerHTML = "Enter usename and password";
    } else {
               $('#img').hide();

        $.ajax({

            type: "GET",
            url: "http://192.168.0.208/DoctorLogin/Doctor/Login?user=" + user + "&pwd=" + pwd,
            datatype: "json",
            async: false,
            success: function(result) {
 $('#img').show();
                var obj = jQuery.parseJSON(result);
                sessionStorage.setItem('doccode', "" + obj.doccode + "");
                sessionStorage.setItem('docname', "" + obj.docname + "");

                if (obj.id == "1") {

                    window.location = "home.html";

                } else {
                    document.getElementById('spnerror').innerHTML = "usename or password is wrong";
					$('#img').hide();
                }

            }
        });

    }
    $(window).load(function() {
        $('#gif').show();
        return true;
    })
});

var usid = sessionStorage.getItem('userid'); //username
$('#userid').text("" + usid + "");
var docnme = sessionStorage.getItem('docname'); //doctorname
$('#docne').text("" + docnme + "");