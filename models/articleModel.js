const db = require('../db/connection.js');

exports.fetchArticles = (article_id) => {
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1;
    `, [article_id])
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
    // use a sophisticated query to return the article table, excluding body column, and featuring a column_count column, using Count() aggregate function and Group By
    // once query returns, proceed as normally, passing it back to the controller, sending back a response and handling any errors
    // since there is no query or parametric input from the client, there, in theory, cant be any client errors, but error handling chain should still take care of 500s (i.e we code wrong)
    // update endpoints.json once complete

    return db.query(`
    SELECT
    articles.*,
    COUNT(comments.comment_id) AS comment_count
FROM
    articles
LEFT JOIN
    comments ON articles.article_id = comments.article_id
GROUP BY
    articles.article_id
ORDER BY
    articles.date_column DESC;
    `)
    .then(data=>{
        console.log(data);
    })
}