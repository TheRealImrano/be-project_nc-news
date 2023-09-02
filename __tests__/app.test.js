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
            .post('/api/articles/3/comments')
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
            .post('/api/articles/3/comments')
            .send(reqBody)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("bad request - malformed body")
            });
        })
        test('returns 400 - bad request when passed a parametric endpoint value that is in the correct format, but doesn\'t exist on the database (i.e. doesn\'t correspond to any actual article or comment)', ()=>{
            const reqBody = {
                username: 'icellusedkars',
                body: 'testing for comment'
            }

            return request(app)
            .post('/api/articles/10000/comments')
            .send(reqBody)
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe("Bad Request")
            })
        })
    })
    describe('PATCH /api/articles/:article_id', ()=>{
        test('endpoint responds with the successfully updated article with a new votes, when provided a correct request body and correct parametric endpoint value', ()=>{
            const reqBody = {
                inc_votes : 5
            }
            let currentVotes = 0;

            return request(app)
            .patch('/api/articles/1')
            .send(reqBody)
            .expect(201)
            .then(response=>{
                const {article} = response.body;
                const {votes} = article;
                currentVotes = votes;

                const expectedProperties = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'body'];

                expect(Object.keys(article)).toHaveLength(8);
                expectedProperties.forEach((property)=>{
                    expect(article).toHaveProperty(property);
                })
                return response;
            })
            .then((res)=>{
                return request(app)
                .patch('/api/articles/1')
                .send(reqBody)
                .expect(201)
                .then(response=>{
                    const newVotes = response.body.article.votes;
                    const {inc_votes} = reqBody
                    
                    expect(newVotes - currentVotes).toEqual(inc_votes);
                })
            })
        })
        test('returns 400; \'bad request\', when passed a parametric value that is not an integer', ()=>{
            const reqBody = {
                inc_votes : 5
            }

            return request(app)
            .patch('/api/articles/three')
            .send(reqBody)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request");
                expect(response.body.code).toBe(400);
            });
        })
        test('returns 400; \'bad request - malformed body\', when passed a request body with incorrect formatting (i.e. insufficient/ wrong properties present)', ()=>{
            const reqBody = {
                body: 'malformed'
            }

            return request(app)
            .patch('/api/articles/1')
            .send(reqBody)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("bad request - malformed body")
            });
        })
        test('returns 404 - Not Found when passed a valid article_id, but one that does not currently exist in database', ()=>{
            const reqBody = {
                inc_votes : 5
            }

            return request(app)
            .patch('/api/articles/10000')
            .send(reqBody)
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe("Not Found")
            })
        })
    })
})

describe('Comments', ()=>{
    describe('DELETE /api/comments/:comment_id', ()=>{
        test('endpoint should delete the given comment by comment_id, and return a 204 status code with no content', ()=>{
            return request(app)
            .delete('/api/comments/1')
            .expect(204)
            .then((response)=>{
                expect(response.body).toEqual({});
            })
        })
        test('responds with 404 - comment not found, when passed a comment_id in a valid format but does not exist', ()=>{
            return request(app)
            .delete('/api/comments/2000000')
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe("comment not found.")
            })
        })
        test('responds with 400 - bad request - malformed body when passed a comment_id that is not an integer', ()=>{
            return request(app)
            .delete('/api/comments/two')
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe("bad request - malformed body")
            })
        })
    })
})
