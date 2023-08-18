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
        test('endpoint responds with an data about an article, determined dynamically by the parametric \':article_id\'; sends 200', ()=>{
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response)=>{
                const {article} = response.body;
                const expectedProperties = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url'];

                expect(Object.keys(article)).toHaveLength(8)
                expectedProperties.forEach((property)=>{
                    expect(article).toHaveProperty(property);
                })

            })
        })
        test('returns 400; \'bad request - invalid data format\', when passed a parametric value that is not an integer', ()=>{
            return request(app)
            .get('/api/articles/one')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request");
                expect(response.body.code).toBe(400);
            });
        })
        test('returns 404; \'not found\' when passed a valid article_id that doesn\'t exist in the database', ()=>{
            return request(app)
            .get('/api/articles/2023')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Not Found")
            });
        })
    })
    describe('GET /api/articles', ()=>{
        test('endpoint responds with data about all articles, save for body, as well as a comment count', ()=>{
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response)=>{
                const {articles} = response.body;
                const expectedProperties = ['article_id', 'title', 'topic', 'author', 'comment_count', 'created_at', 'votes', 'article_img_url'];

                expect(articles).toHaveLength(13);
                articles.forEach((article)=>{
                    expect(Object.keys(article)).toHaveLength(8);
                    expect(article).not.toHaveProperty('body')
                    expectedProperties.forEach((property)=>{
                        expect(article).toHaveProperty(property);
                    })
                })
            })
        })
        test('data returned from endpoint has articles listed by date in descending order', ()=>{
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response)=>{
                const {articles} = response.body;

                expect(articles).toBeSortedBy('created_at', {
                    descending: true,
                })
            })
        })
    })
})
