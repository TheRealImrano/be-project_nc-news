const db = require('../db/connection.js');

exports.removeComment = (id) => {
    const num = parseFloat(id);

    if (isNaN(num)){
        return Promise.reject({
            status: 400,
            msg: "bad request - malformed body",
          });
    }

    return db.query('DELETE FROM comments WHERE comment_id = $1', [id])
    .then((data)=>{
        if (data.rowCount === 0){
            return Promise.reject({
                status: 404,
                msg: "comment not found.",
            });
        } else return data;
    })
}