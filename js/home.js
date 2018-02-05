//getting json data from url
$(document).ready(function() {
    $('#msgbox').hide(); //hide msgbox
    var docname = sessionStorage.getItem('doccode'); //doctor code

    $.ajax({
        url: 'http://192.168.0.208/DoctorLogin/Doctor/Home?docname=' + docname,
        method: 'post',
        dataType: 'json',
        success: function(data) {

            var table = $('#myTable').dataTable({
                data: data,

                columns: [{
                    "data": "id",
                    render: function(data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                }, {
                    'data': 'uhid'
                }, {
                    'data': 'patientname'
                }, {
                    'data': 'age'
                }, {
                    'data': 'gender'
                }, {
                    'data': 'amount'
                }, {
                    sortable: false,
                    "render": function(data, type, full, meta) {
                        var amont = full.amount;
                        return '<input type="text" id="mamount" value=' + amont + ' class="form-control" required/>';
                    }
                }, {
                    'defaultContent': '<button type="button" class="btn btn-primary"  data-toggle="modal" data-target="#myModal">Confirm</button>'
                }]

            });
            var table = $('#myTable').DataTable();

            $('#myTable tbody').on('click', 'tr', function() { //onclick row toggle background color  
                $('table.table-hover tbody tr').on('click', function() {
                    $(this).closest('table').find('td').removeClass('bg');
                    $(this).find('td').addClass('bg');
                });

            });
            //getting row details
            $('#myTable tbody').on('click', 'button', function() {
                var data = table.row($(this).parents('tr')).data();
                var modifiedamt = $(this).closest('tr').find('#mamount').val();
                $("#confidamt").text("" + modifiedamt + "");
                $("#patname").text("" + data.patientname + "");


                // post the data to confirm
                $('#conf').click(function(e) {
                    var input = {
                        "uhid": "" + data.uhid + "",
                        "doccode": "" + docname + "",
                        "amount": "" + modifiedamt + ""
                    };
                    $.ajax({
                        type: 'POST',
                        url: 'http://192.168.0.208/DoctorLogin/Doctor/Confirm',
                        data: JSON.stringify(input),
                        crossDomain: true,
                        dataType: 'text json',
                        contentType: 'application/json; charset=utf-8',
                    });

					 $(window).load(function() {      //onclick confirm open loader
                    $(".loader").fadeOut("slow");
                    })

                    //to check successfully posted or not
                    $.ajax({

                        type: "GET",
                        url: "http://192.168.0.208/DoctorLogin/Doctor/Confirm?uhid=" + data.uhid + "&doccode=" + docname + "&amount=" + data.amount,
                        datatype: "json",
                        async: false,
                        success: function(result) {

                            var obj = jQuery.parseJSON(result);

                            if (obj.id == "1") {

                                $("#myMessage").text("patient confirmed successfull");

                            } else {
                                $("#myMessage").text("patient confirmed unsuccessfull");
                            }

                        }
                    });
                  
                     

                    $('#suces').click(function(e) {
                        window.location.reload();
                    });

                });
            });
        }
    });

    // confirmed patients detais 
    $.ajax({
        url: 'http://192.168.0.208/DoctorLogin/Doctor/GetConfirm?doccode=' + docname,
        method: 'post',
        dataType: 'json',
        success: function(data) {
            var table = $('#mTable').dataTable({
                data: data,

                columns: [{
                    "data": "id",
                    render: function(data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                }, {
                    'data': 'uhid'
                }, {
                    'data': 'patientname'
                }, {
                    'data': 'age'
                }, {
                    'data': 'gender'
                }, {
                    'data': 'amount'
                }]


            });

            var patins = jQuery.parseJSON(JSON.stringify(data));

            if (patins.uhid != "0") {

                var noofpatients = Object.keys(data).length; //count the number of patients
                $("#totnoofpatients").text(noofpatients);
            } else {
                $("#totnoofpatients").text("0");
            }




            var totalamunt = JSON.stringify(data);
            var totamt = { //count total amount of confirmed patients
                    taxes: "" + totalamunt + ""
                },
                total = 0,
                confirmedTotal = totamt.taxes,
                i;

            for (i = 0; i < JSON.parse(confirmedTotal).length; i++) {
                total += JSON.parse(confirmedTotal)[i].amount;
                $("#TOTAL").text(total);
            }

        }


    });



    // to fit window for modals
    $('#myModal1').on('shown.bs.modal', function(e) {
        $.fn.dataTable.tables({
            visible: true,
            api: true
        }).columns.adjust();
    });

});