'use strict';

//server architecture

require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const superagent = require('superagent');

const PORT = process.env.PORT;
//const MAPS_API = process.env.MAPS_API;

//pathing
app.get('/location', searchToLatLong)

app.get('/weather', (request, response) => {
  const weatherData = searchWeather(request.query.data);
  response.send(weatherData);
})


app.get('/testing', (request, response) => {
  console.log('Im here.');
  const test = {test: `this works on PORT${PORT}`}
  response.sendStatus(test);
});



app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

function handleError(err, res){
  console.error(err);
  if (res) res.status(500).send('Sorry, we seem to have a bit of a problem.')
}

//helper functions

//location

function searchToLatLong(request, response){
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API}`;

  return superagent.get(url)
    .then(result => {
      response.send(new Location(request.query.data, result))
    })
    .catch(error => handleError(error));
}

function Location(query, location){
  this.search_query = query;
  this.formatted_query = location.body.results[0].formatted_address;
  this.latitude = location.body.results[0].geometry.location.lat;
  this.longitude = location.body.results[0].geometry.location.lng;
}


//weather

function searchWeather(query){

  const darkSky = require('./data/darksky.json');
  let weatherArray = []

  darkSky.daily.data.forEach(day =>{
    weatherArray.push(new Weather(day));
  });

  // weather.search_query = query;
  console.log(weatherArray);
  return weatherArray;
}


function Weather(day){
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

