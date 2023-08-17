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