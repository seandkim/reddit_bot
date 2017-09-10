var express = require('express')
const Language = require('@google-cloud/language');
var url = require('url');
var fs = require('fs'); // for opening json file

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

// database handling
// keyword => commentID
var json = JSON.parse(fs.readFileSync('example.json', 'utf8'));
// console.log("JSON is", json)
var dict = new Map();
for (var idx in json) {
  var e = json[idx]
  dict.set(e['keyword'], e['commentID'])
}

// commentID => comment
var comments = fs.readFileSync('comments.csv', 'utf8').split('\n');

// takes in a list of keywords
// returns a best response from the database
function searchDatabase(kws) {
  function getRandomElem(L) {
    //The maximum is exclusive and the minimum is inclusive
    min = Math.ceil(0);
    max = Math.floor(L.length);
    idx = Math.floor(Math.random() * (max - min)) + min;
    return L[idx]
  }

  const kw = getRandomElem(kws)
  const commentID = getRandomElem(dict.get(kw))
  return comments[commentID]
}

// communication with html (client)
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
        console.log("analyzeEntities succeeded", results)
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
        console.log("analyzeEntities failed", err)
        const response = {
          success: false,
          keywords: null,
          comment: null,
        };

        socket.emit('post_result', response);
      });
  }
});

http.listen(3000, function() {
  console.log('listening on ' + 3000);
});
