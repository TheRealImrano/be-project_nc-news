const request = require('supertest');
const seed = require('../db/seeds/seed.js');
const data = require("../db/data/test-data");
const db = require('../db/connection.js');
const app = require('../app.js');
const { readJsonFile } = require('../utils/jsonReader.js');

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

describe('api; GET /api', ()=>{
    test('endpoint GET /api responds with information about the api, and how to use it', ()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then((response)=>{
            const filePath = './endpoints.json';
            readJsonFile(filePath)
            .then(result => {
                expect(response.body).toEqual(result);
            })
            // expect(response.body).toEqual(readJsonFile(filePath));
        })
    })
})



