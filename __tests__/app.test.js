const request = require('supertest');
const seed = require('../db/seeds/seed.js');
const data = require("../db/data/test-data");
const db = require('../db/connection.js');
const app = require('../app.js');

beforeEach(() => {
    return seed(data);
});
afterAll(() => {
    return db.end();
});


describe('topics', ()=>{
    describe('GET /api/topics', ()=>{
        test('returns all topics from the database nc_news_test', ()=>{
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then((response)=>{
                    const {topics} = response.body;
                    expect(typeof topics).toBe('object');
                    expect(topics).toHaveLength(3);
                    topics.forEach(topic => {
                        expect(topic).toHaveProperty('slug');
                        expect(topic).toHaveProperty('description');
                    });
                })
        })
    })
})





