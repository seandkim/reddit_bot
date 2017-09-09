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
    gcloudAPI(post_text);
    return false;
  })

  function gcloudAPI(text) {
    // socket.emit('post_result', "hello");
    console.log("gcloudAPI start");

    const document = {
      'content': text,
      type: 'PLAIN_TEXT'
    };

    // Detects the sentiment of the text
    language.analyzeEntities({'document': document})
      .then((results) => {
        const sentiment = results[0].documentSentiment;

        console.log(`Text: ${text}`);
        console.log(`Sentiment score: ${sentiment.score}`);
        console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

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
