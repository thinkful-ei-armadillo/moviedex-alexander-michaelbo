'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

const getRequest = request(app)
  .get('/movie')
  .set({ Authorization: 'b0c925e22-35f7-11e9-b210-d663bd873d93' });

describe('GET /movie', () => {
  it('should return an array of movies', () => {
    return getRequest
      .expect(200)
      .expect('content-type', /json/)
      .then(resp => {
        expect(resp.body).to.be.an('array');
      });
  });

  describe('Filter by Genre', () => {
    it('should return an array of movies filtered by genre', () => {
      return getRequest
        .send({genre: 'com'})
        .expect(200)
        .expect('content-type', /json/)
        .then(resp => {
          let i = 0;
          let genresFiltered = true;
          while (genresFiltered && i < resp.length) {
            genresFiltered = genresFiltered && resp[i].genre.toLowerCase().includes('com');
            i++;
          }
          expect(genresFiltered).to.be.true;
        });
    });
  });

  describe('Filter by Country', () => {
    it('should return an array of movies filtered by country', () => {
      return getRequest
        .send({country: 'mex'})
        .expect(200)
        .expect('content-type', /json/)
        .then(resp => {
          let i = 0;
          let countriesFiltered = true;
          while (countriesFiltered && i < resp.length) {
            countriesFiltered = countriesFiltered && resp[i].country.toLowerCase().includes('mex');
            i++;
          }
          expect(countriesFiltered).to.be.true;
        });
    });
  });

  describe('Filter by Avg. Vote', () => {
    it('should return an array of movies filtered by avg vote (greater than or equal to)', () => {
      return getRequest
        .send({avgvote: '2.134'})
        .expect(200)
        .expect('content-type', /json/)
        .then(resp => {
          let i = 0;
          let votesFiltered = true;
          while (votesFiltered && i < resp.length) {
            votesFiltered = votesFiltered && resp[i].avg_vote >= 2.134;
            i++;
          }
          expect(votesFiltered).to.be.true;
        });
    });

    it('should return an error if provided avgvote is not a number', () => {
      return getRequest
        .send({avgvote: 'asdf'})
        .expect(400, 'Supplied avg. vote value must be a number');
    });
  });
});