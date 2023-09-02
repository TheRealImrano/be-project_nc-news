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

exports.updateArticle = (id, request) => {
    if (request.inc_votes === undefined || Object.keys(request).length !== 1 || typeof request.inc_votes !== 'number'){
        return Promise.reject({
            status: 400,
            msg: "bad request - malformed body",
          });
    }

    return db.query(`
        SELECT votes FROM articles
        WHERE article_id = $1;
    `, [id])
    .then((data)=>{
        if (data.rowCount === 0) {
            return Promise.reject({
              status: 404,
              msg: "Not Found",
            });
        }
        const voteCount = data.rows[0].votes;
        const updatedVotes = request.inc_votes + voteCount;
        return db.query(`
            UPDATE articles
            SET votes = $1
            WHERE article_id = $2
            RETURNING *;
        `, [updatedVotes, id])
    })
    .then((data)=>{
        return data.rows[0];
    })
}

// do a SELECT query to obtain current vote count, storing that value
// update the value of votes by taking the sum of our obtained value and provided value