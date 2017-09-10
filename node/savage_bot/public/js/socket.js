var socket = io();
var DEFAULT_RESPONSE = 'As if I would care.'

$(document).ready(function() {
    // listen for result
    socket.on('post_result', function(response) {
      if (response['success']) {
        const keywords = response['keywords']
        const comment = response['comment']
        console.log("result from server: ", keywords, comment);
        $('#feedback').html(DEFAULT_RESPONSE)
      } else {
        console.log("post_result socket call failed")
        
        $('#feedback').html(DEFAULT_RESPONSE)
      }
    });
});
