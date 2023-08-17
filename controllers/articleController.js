const { fetchArticles } = require("../models/articleModel");

exports.getArticles = (req, res, next) => {
    const {article_id} = req.params;

    fetchArticles(article_id)
    .then((data)=>{
        res.status(200).send({article: data.rows[0]});
    })
    .catch((err) => {
        next(err);
    });
}