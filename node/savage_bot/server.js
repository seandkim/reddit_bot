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
var dict = new Map();
var kwFiles = ['kw1000.json', 'kw5000-1.json']

for (var i=0; i < kwFiles.length; i++) {
  var json = JSON.parse(fs.readFileSync('data/' + kwFiles[i], 'utf8'));
  console.log("JSON number of entry is", json.length)
  for (var idx in json) {
    var e = json[idx]
    var kw = e['keyword'];
    var comments = e['commentID'];

    if (kw in dict) {
      dict.set(kw, dict.get(kw).concat(comments))
    } else {
      dict.set(kw, comments)
    }
  }
}
// console.log(dict)
// console.log("Total entry in dict", dict.keys())

// commentID => comment
var comments = fs.readFileSync('comments.csv', 'utf8').split('\n');

function getRandomElem(L) {
  //The maximum is exclusive and the minimum is inclusive
  min = Math.ceil(0);
  max = Math.floor(L.length);
  idx = Math.floor(Math.random() * (max - min)) + min;
  return L[idx]
}

// takes in a list of keywords
// returns a best response from the database
function searchDatabase(kw) {
  const commentID = getRandomElem(dict.get(kw))
  console.log(commentID, comments[commentID])
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

    var kws = null;
    var kw = null;
    // Detects the sentiment of the text
    language.analyzeEntities({'document': document})
      .then((results) => {
        console.log("analyzeEntities succeeded", results);
        kws = results[0]['entities'].map(function(e) {return e['name']});
        kw = getRandomElem(kws);
        const comment = searchDatabase(kw);

        const response = {
          success: true,
          keywords: kws,
          selected_keyword: kw,
          comment: comment
        };

        socket.emit('post_result', response);
      })
      .catch((err) => {
        console.log("analyzeEntities failed", err)
        const response = {
          success: false,
          keywords: kws,
          selected_keyword: kw,
          comment: null,
        };

        socket.emit('post_result', response);
      });
  }
});

http.listen(3000, function() {
  console.log('listening on ' + 3000);
});
