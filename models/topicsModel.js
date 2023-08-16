const db = require('../db/connection.js');
const format = require('pg-format');


exports.fetchTopics = () => {
    return db.query(
        `SELECT * FROM topics;`
    )
    .then((result)=>{
        return result;
    })
}