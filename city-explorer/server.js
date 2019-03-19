'use strict';

require('dotenv').config();

const express = require('express');
const app = express(); 

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT;

app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data)
  response.send(locationData);
})