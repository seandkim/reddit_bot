var express = require('express')
const Language = require('@google-cloud/language');

// start on port 3000
var app = express()
var http = require('http').Server(app)

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

http.listen(3000, function() {
  console.log("listening on port 3000")
})


// instantiate google cloud machine learning API



// The text to analyze
const text = 'Hello, world!';

const document = {
  'content': text,
  type: 'PLAIN_TEXT'
};

// Detects the sentiment of the text
language.analyzeSentiment({'document': document})
  .then((results) => {
    const sentiment = results[0].documentSentiment;

    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
