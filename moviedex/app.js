'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const movies = require('./movies.json');

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(function validateBearerToken(req, res, next) {
  let bearerToken = req.get('Authorization');
  if (!bearerToken) {
    return res.status(401).json({error: 'Please provide your bearer API_KEY'});
  }
  bearerToken = bearerToken.slice(bearerToken.indexOf(' ')+1);
  const apiToken = process.env.API_TOKEN;

  if (!apiToken && bearerToken !== apiToken) {
    return res.status(401).json({error: 'Unauthorized request'});
  }
  next();
});

function handleGetMovies(req, res) {
  let response = movies;

  if (req.query.genre) {
    response = response.filter(item => item.genre.toLowerCase().includes(req.query.genre.toLowerCase()));
  }

  if (req.query.country){
    response = response.filter(item => item.county.toLowerCase().includes(req.query.country.toLowerCase()));
  }

  if (req.query.avgvote) {
    const queryAvgVote = parseFloat(req.query.avgvote);
    if (queryAvgVote.isNan()) {
      res.status(400).send('Supplied avg. vote value must be a number');
    }
    response = response.filter(item => item.avg_vote >= queryAvgVote);
  }

  res.send(response);
}



app.get('/movie', handleGetMovies);



module.exports = app;