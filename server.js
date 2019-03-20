'use strict';

//server architecture

require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT;
//const MAPS_API = process.env.MAPS_API;

//pathing
app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data);
  response.send(locationData);
});

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

//helper functions

//location

function searchToLatLong(query){

  const geoData = require('./data/geo.json');
  const location = new Location(geoData);
  location.search_query = query;
  console.log(location);
  return location;
}

function Location(data){
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}

//weather
//refactored to push weather constructor into weather array
function searchWeather(query) {
// if(Location.latitude === 'latitude' && Location.longitude === 'longitude'){
  const darkSky = require('./data/darksky.json');
  let weatherArray = [];

  darkSky.daily.data.forEach(day => {
  // let weather = new Weather(day);
    weatherArray.push(new Weather(day));
  });
  // const weather = new Weather(darkSky);
  // weather.search_query = query;
  console.log(weatherArray);
  return weatherArray;
}


function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0,15);

}

