// Tooltip Init
$(function() {
    $("[data-toggle='tooltip']").tooltip();
});

// Contact Form Script
$(function() {
    $("#contactForm").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "//formspree.io/bhuvan@bhuvanrawal.me",
            method: "POST",
            data: $(this).serialize(),
            dataType: "json",
            success: function(data){
                // Success message
                $('#success').html("<div class='alert alert-success'>");
                $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                    .append("</button>");
                $('#success > .alert-success')
                    .append("<strong>Your message has been sent. </strong>");
                $('#success > .alert-success')
                    .append('</div>');

                //clear all fields
                $('#contactForm').trigger("reset");
            },
            error: function(){
                // Fail message
                $('#success').html("<div class='alert alert-danger'>");
                $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                    .append("</button>");
                $('#success > .alert-danger').append("<strong>Sorry it seems that my mail server is not responding. Please try again later!");
                $('#success > .alert-danger').append('</div>');
                //clear all fields
                $('#contactForm').trigger("reset");
            }
        });
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});


// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});
