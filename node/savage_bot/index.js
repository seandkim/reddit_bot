var socket = io();

$(document).ready( function() {
  $('form').submit(function(e) {
    socket.emit('post_analyze', $('textarea#post').val());
    $('textarea#post').val('');

    return false; // prevent default action
  });

  // listen for result
  socket.on('post_result', function (results) {
    const keywords = results[0]['entities'];

    console.log("post result from client", keywords);

    // $('div.result').html("keywords: " + keywords)
    $('div.result').html("keywords: " + keywords.map(function(x) {x['name']}))
  });
});
