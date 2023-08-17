const db = require('../db/connection.js');

exports.fetchArticles = (article_id) => {
    if (isNaN(parseInt(article_id))){
        return Promise.reject({
            status: 400,
            msg: 'bad request - invalid data format',
        });
    };

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
        return data;
    })
}