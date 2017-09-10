var express = require('express')
const Language = require('@google-cloud/language');
var url = require('url');

// start on port 3000
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http);
const language = Language(); // Instantiates a gcloud client

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  // console.log("query string = ", req.query) //respond to query

  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket) {
  socket.on('post_analyze', function(post_text) {
    console.log("received post_analyze:", post_text);
    analyzeEntities(post_text);
    return false;
  })

  function analyzeEntities(text) {
    const document = {
      'content': text,
      type: 'PLAIN_TEXT'
    };

    // Detects the sentiment of the text
    language.analyzeEntities({'document': document})
      .then((results) => {
        console.log("analyzeEntities succeeded")
        const kws = results[0]['entities'].map(function(e) {return e['name']})
        const comment = searchDatabase(kws);

        const response = {
          success: true,
          keywords: kws,
          comment: comment
        };

        socket.emit('post_result', response);
      })
      .catch((err) => {
        console.log("analyzeEntities failed")
        const response = {
          success: false,
          keywords: null,
          comment: null,
        };

        socket.emit('post_result', response);
      });
  }
});


// takes in a list of keywords
// returns a best response from the database
function searchDatabase(kws) {
  return "Your mom";
}


http.listen(3000, function() {
  console.log('listening on ' + 3000);
});
