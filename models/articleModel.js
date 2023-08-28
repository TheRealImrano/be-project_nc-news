const db = require('../db/connection.js');

exports.fetchArticles = (id) => {
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1;
    `, [id])
    .then((data)=>{
        if (data.rowCount === 0) {
            return Promise.reject({
              status: 404,
              msg: "Not Found",
            });
        }
        return data.rows[0];
    })
}

exports.fetchAllArticles = () => {

    return db.query(`
    SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
    FROM
        articles
    LEFT JOIN
        comments ON articles.article_id = comments.article_id
    GROUP BY
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url
    ORDER BY
        articles.created_at DESC;
    `)
    .then(data=>{
        return data.rows;
    })
}

exports.fetchCommentsById = (id) => {
    const values = [id];

    return db.query(`
        SELECT *
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;    
    `, values)
    .then(data=>{
        if (data.rowCount === 0) {
            return Promise.reject({
              status: 404,
              msg: "Not Found",
            });
        }
        return data.rows;
    })
}

exports.createComment = (id, request) => {
    if (request.body === undefined || request.username === undefined || Object.keys(request).length !== 2){
        return Promise.reject({
            status: 400,
            msg: "bad request - malformed body",
          });
    }

    return db.query(`
        INSERT INTO comments (author, article_id, body)
        VALUES ($1, $2, $3)
        RETURNING *;   
    `, [request.username, id, request.body])
    .then(data=>{
        return data.rows[0]
    })
}