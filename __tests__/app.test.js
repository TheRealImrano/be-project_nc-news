const request = require('supertest');
const seed = require('../db/seeds/seed.js');
const data = require("../db/data/test-data");
const db = require('../db/connection.js');
const app = require('../app.js');
const fs = require('fs/promises');

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
            return fs.readFile(filePath, 'utf-8')
                .then(jsonData => {
                    return JSON.parse(jsonData)
                })
                .then((result)=>{
                    expect(response.body).toEqual(result);
                })
        })
    })
})

describe('Articles', ()=>{
    describe('GET /api/articles/:article_id', ()=>{
        test.only('endpoint responds with an data about an article, determined dynamically by the parametric \':article_id\'; sends 200', ()=>{
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response)=>{
                console.log(response.body);
            })
        })
    })
})

