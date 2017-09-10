$(function () {

    var state = 0; /* 0 = home, 1 = form, 2 = result */

    $('#msg-form').hide();
    $('.chat-response').hide();
    $('#savage-says').hide();

    // for hack description
    $('#info').hover(function () {
        $('.hack-description').css("visibility", "visible");
    }, function () {
        $('.hack-description').css("visibility", "hidden");
    });

    $(document).click(function() {
       if (state == 0) {
           state++;
           $('.logo-container').fadeOut(1000, function() {
               $('.main-form').fadeIn(500);
           });
           $('#snow').fadeOut();
       }
    });

    // press enter to submit form
    $('#msg-form').keydown(function(e) {
        if (state != 1) {
            return;
        }
        if (e.keyCode == 13) {
            // request ajax call to node server
            var inputData = $('#request-string').val();
            socket.emit('post_analyze', inputData);

            $('#feedback').html('<div class="circle hollow"></div>');
            return false; // prevents default action (submitting to new page)
        }
    });

});

$(document).mousemove(function (event) {

    if (window.event) {
        event = window.event;
    }

    var mousepositionx = event.pageX;
    var mouseposition = event.pageY;

    var x = 25 + mousepositionx * 0.01;
    var y = mouseposition * 0.01;

    var x_slow = -5 - mousepositionx * 0.005;
    var y_slow = mouseposition * 0.005;

    $('#figure').css({
        "transform": "translate(" + x + "%," + y + "%)"
    });

    $('#bg').css({
        "transform": "translate(" + x_slow + "%," + y_slow + "%)"
    })

});

function removeLoadingAnimation() {
    $('#savage-says').fadeOut();
    $('#feedback').html('');
};
