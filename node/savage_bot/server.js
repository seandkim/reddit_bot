var express = require('express')
const Language = require('@google-cloud/language');
var url = require('url');

// start on port 3000
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http);
const language = Language(); // Instantiates a gcloud client

app.get('/', function(req, res) {
  // console.log("query string = ", req.query) //respond to query

  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket) {
  socket.on('post_analyze', function(post_text) {
    console.log("post_analyze:", post_text);
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
        socket.emit('post_result', results);
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });
  }
});

http.listen(3000, function() {
  console.log('listening on ' + 3000);
});
