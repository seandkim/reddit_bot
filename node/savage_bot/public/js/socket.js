var socket = io();
var DEFAULT_RESPONSES = [ "Okay. Good to know.",
					"Sounds like something I would say if I didn't sleep for a week.",
					"Staring at the fan spinning is probably more interesting than responding to you.",
					"Hello darkness my old friend.",
					"That's a nice move, but it's better if you didn't move.",
					"See that blank wall? The decor matches your personality.",
					"...You're probably an engineer.",
					"I wanted to say something wholesome - but I have no desire now that when I see you.",
					"What's your name again? Actually... nevermind, I don't want to know.",
					"You look like you're always on your phone",
					"Speak English, not code.",
					"My proudest achievement is to talk to you without walking away.",
					"You look like someone who would use a PC.",
					"Adam and Eve would never eat the apple if they knew you would be their offspring.",
					"Seems like you're lonely but you have no friends so you have to talk to me.",
					"...You look like someone who would stil believe in Santa Claus when you're 20."]

$(document).ready(function() {
    function getRandomElem(L) {
      //The maximum is exclusive and the minimum is inclusive
      min = Math.ceil(0);
      max = Math.floor(L.length);
      idx = Math.floor(Math.random() * (max - min)) + min;
      return L[idx]
    }

    // listen for result
    socket.on('post_result', function(response) {
			$('#feedback').html('');
      if (response['success']) {
        console.log("result from server: ", response);
        $('#savage-says').fadeIn().html(response['comment']);
      } else {
        console.log("post_result socket call failed", response)
        $('#savage-says').fadeIn().html(getRandomElem(DEFAULT_RESPONSES))
      }
    });
});
