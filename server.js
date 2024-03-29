const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { debuglog } = require('util');
const { parseMerriamWebsterResponseJson } = require('./src/definition');
const { OpenAI } = require("openai");


//Load the dotenv file.
dotenv.config();


//Initialize and configure express.
const express_app = express();
const port = process.env.SERVER_PORT || '8888';
const dictionary_api_key = process.env.DICTIONARY_API_KEY;


//Setup static file serving
//express_app.use('/', express.static(path.join(__dirname, 'static-files')));


//Setup app to handle JSON
express_app.use(express.urlencoded({ extended: true }));
express_app.use(express.json());


//Setup OpenAI instance.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


//Setup routing
express_app.get("/api", (request, response) => {
  response.json({
    message: "Hello world!",
  });
});


express_app.get("/api/define", async (request, response) => {
  const word = request.query.word;
  const url = `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${dictionary_api_key}`;


  try {

    const merriam_webster_response_object = await fetch(url);

    //Convert the raw response object into JSON.
    const merriam_webster_response_json = await merriam_webster_response_object.json();


    //Parse the raw JSON data into a simplified object for our application.
    if (merriam_webster_response_json.length > 0 && merriam_webster_response_json[0].hasOwnProperty("meta")) {
      require("./src/definition.js");
      response.json({
        "rawData": merriam_webster_response_json,
        "data": parseMerriamWebsterResponseJson(merriam_webster_response_json)
      });
    }
    else {
      response.json({
        "rawData": merriam_webster_response_json,
        "data": [],
        "suggestions": merriam_webster_response_json,
      });
    }
  }
  catch (error) {
    console.log(`An error occured trying to retreive definition data: ${error}`);
  }

});


express_app.get("/api/search-lyrics", async (request, response) => {
  console.log("Requesting word lyric...");

  const word = request.query.word;
  const proompt = `Given the following word "${word}", find me a song that contains this word in it's lyrics. The lyric must contain the word, and the output should be in the following JSON format : {lyrics: LYRICS, artist: ARTIST, songName: SONG_NAME}`;

  const gpt3_result = await openai.chat.completions.create({
    messages: [{ role: "user", content: proompt }],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    n: 1,
  });


  //Format the GPT3 Result
  const lyrics = [];
  console.log(gpt3_result.choices.length);
  gpt3_result.choices.forEach(c => {
    if (c.message.content !== null) {
      console.log(c.message.content);
      lyrics.push(JSON.parse(c.message.content));
    }
  });

  console.log(lyrics);


  response.json({
    lyrics: lyrics,
  });
});



//express_app.get("/api/search-lyrics", async (request, response) => {
//  const word = request.query.word;
//  const url = `https://api.ksoft.si/lyrics/search?q=${word}&text_only=true`;
//
//
//  console.log(`Preparing to find lyrics containing the following word : ${word}`);
//  console.log(`Using URL : ${url}`);
//  const lyric_response_object = await fetch(url);
//  const lyric_response_text =
//
//
//    //Convert the raw response object into JSON.
//    //const lyric_response_json = await lyric_response_object.json();
//
//
//    //response.json(lyric_response_json);
//    response.send(lyric_response_object);
//});



//express_app.get('/shop', async (request, response) => {
//
//  let page_number = Number(request.query.page);
//  if (Number.isNaN(page_number) || page_number === 0) page_number = 1;
//
//  let items_per_page = Number(request.query.limit);
//  if (Number.isNaN(items_per_page) || items_per_page === 0) items_per_page = 10;
//
//
//  const results = await db.getItemList(page_number, items_per_page);
//  const total_pages = await db.getTotalItemPages(items_per_page);
//
//  const item_categories = await db.getItemCategories();
//
//  console.log(results);
//  //console.log(item_categories);
//  //console.log(total_pages);
//
//  response.render('shop', {
//    pageTitle: "shop",
//    items: results,
//    totalPages: total_pages,
//    currentPage: page_number,
//    categories: item_categories,
//  });
//});
//
//
//express_app.get('/itemDetails', async (request, response) => {
//
//  //const result = await db.getItemList(page_number, items_per_page);
//  const id = request.query.id;
//  console.log(`Received getItemDetails(${id});`);
//
//
//
//  const result = await db.getItemDetails(id);
//
//  console.log(result);
//
//
//  response.render("itemDetails", {
//    pageTitle: "itemDetails",
//    item: result,
//    solidHeader: true,
//  });
//});
//
//
//
//express_app.get('/api/getRelatedItems', async (request, response) => {
//
//  //const result = await db.getItemList(page_number, items_per_page);
//  let quantity = Number(request.query.quantity);
//  if (Number.isNaN(quantity) === true) {
//
//    quantity = 10;
//  }
//
//
//  const category = request.query.category;
//  console.log(`Received getItemDetails(${category});`);
//
//
//  const result = await db.getRelatedItems(category, quantity);
//  response.send(result);
//});



//Start the server.
express_app.listen(port, _ => {
  console.log('server started on localhost:' + port);
});
