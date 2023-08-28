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
        test('returns 400; \'bad request\', when passed a parametric value that is not an integer', ()=>{
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
    describe('GET /api/articles/:article_id/comments', ()=>{
        test('endpoint responds with an array of comments for the given article_id, where comments should be served with the most recent comments first', ()=>{
            return request(app)
            .get('/api/articles/3/comments')
            .expect(200)
            .then((response)=>{
                const {comments} = response.body;
                const expectedProperties = ['comment_id', 'votes', 'created_at', 'author', 'body', 'article_id']

                comments.forEach((comment)=>{
                    expect(Object.keys(comment)).toHaveLength(6);
                    expectedProperties.forEach((property)=>{
                        expect(comment).toHaveProperty(property);
                    })
                })

                expect(comments).toBeSortedBy('created_at', {
                    descending: true,
                })
            })
        })
        test('returns 400; \'bad request\', when passed a parametric value that is not an integer', ()=>{
            return request(app)
            .get('/api/articles/three/comments')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request");
                expect(response.body.code).toBe(400);
            });
        })
        test('returns 404; \'not found\' when passed a valid article_id that doesn\'t exist in the database', ()=>{
            return request(app)
            .get('/api/articles/2023/comments')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Not Found")
            });
        })
    })
    describe('POST /api/articles/:article_id/comments', ()=>{
        test('endpoint responds with the successfully posted comment when provided a correct request body and correct parametric endpoint value', ()=>{

            const reqBody = {
                username: 'icellusedkars',
                body: 'testing for comment'
            }

            return request(app)
            .post('/api/articles/1/comments')
            .send(reqBody)
            .expect(201)
            .then((response)=>{
                const {comment} = response.body
                const expectedProperties = ['comment_id', 'votes', 'created_at', 'author', 'body', 'article_id']

                expectedProperties.forEach((property)=>{
                    expect(comment).toHaveProperty(property);
                })
                expect(Object.keys(comment)).toHaveLength(6);
                
            })
        })
        test('returns 400; \'bad request\', when passed a parametric value that is not an integer', ()=>{
            const reqBody = {
                username: 'icellusedkars',
                body: 'testing for comment'
            }

            return request(app)
            .post('/api/articles/three/comments')
            .send(reqBody)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request");
                expect(response.body.code).toBe(400);
            });
        })
        test('returns 400; \'bad request\', when passed an invalid username (i.e. can\'t comment if user doesn\'t already exist)', ()=>{
            const reqBody = {
                username: 'banana',
                body: 'testing for comment'
            }

            return request(app)
            .post('/api/articles/three/comments')
            .send(reqBody)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request");
                expect(response.body.code).toBe(400);
            });
        })
        test('returns 400; \'bad request - malformed body\', when passed a request body with incorrect formatting (i.e. insufficient/ wrong properties present)', ()=>{
            const reqBody = {
                body: 'testing for comment'
            }

            return request(app)
            .post('/api/articles/three/comments')
            .send(reqBody)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("bad request - malformed body")
            });
        })
    })
})
