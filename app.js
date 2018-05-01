// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


// Load resources
// bda elements
var languages = [];
var curiosity     = JSON.parse(fs.readFileSync('bdaJSON/curiosity.txt', 'utf8'));
var languagesCard = JSON.parse(fs.readFileSync('bdaJSON/languagesCard.txt', 'utf8'));
for (key in languagesCard) {
  languages.push(key);
}
// Credentials for the https
var credentials = {key: privateKey, cert: certificate};

// Create a card in the response
function createCard(title, subtitle, url, text, bttxt) {
  var card = [
    {
      "card": {
        "title": title,
        "subtitle": subtitle,
        "imageUri": url,
        "buttons": [
          {
            "text": text,
            "postback": bttxt
          }
        ]
      }
    }
  ];
  return card
}

// Create response with text
function createResponse(text) {
  var response = {"fulfillmentText": text};
  return response;
}
// Create response with text and cards
function createResponseCard(text, card) {
  response = {"fulfillmentText": text,"fulfillmentMessages": card };
  return response;
}
var card = createCard("hola", "subtitle", "http://pngimg.com/uploads/ruby/ruby_PNG29.png", "text", "http://pngimg.com/uploads/ruby/ruby_PNG29.png")
var responseP = createResponseCard("Carlos si sabe programar en este lenguaje", card);
var responseN = createResponse("Carlos no sabe aún programar en este lenguaje");

// [START hello_world]
// Say hello!
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});
// [END hello_world]

app.post('/', function(request, res) {
  var intentName = request.body.queryResult.intent.displayName;
  console.log(intentName);
  if (intentName == "Curiosity") {
    console.log(request.body.queryResult.parameters.CuriosityCategory);
    var curiosityLocal = curiosity[request.body.queryResult.parameters.CuriosityCategory][0]
    var responseC = {"fulfillmentText": curiosityLocal};
    res.send(responseC);
  }
  else if(intentName == "langaugeCode" ){
    var lang = request.body.queryResult.parameters.language;
    console.log(lang[0]);
    console.log(languagesCard[lang[0]]);
    if(languages.indexOf(lang[0])>-1) {
      card = createCard("hola", "subtitle", languagesCard[lang[0]].url, "text", "http://pngimg.com/uploads/ruby/ruby_PNG29.png")
      responseP = createResponseCard("Carlos si sabe programar en este lenguaje", card);
      res.send(responseP);
    }  else {
      res.send(responseN);
    }
  }
});

if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8081, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
