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
});