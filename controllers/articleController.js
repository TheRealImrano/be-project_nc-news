const { fetchArticles, fetchAllArticles, fetchCommentsById } = require("../models/articleModel");

exports.getArticles = (req, res, next) => {
    const {article_id} = req.params;

    fetchArticles(article_id)
    .then((data)=>{
        res.status(200).send({article: data});
    })
    .catch((err) => {
        next(err);
    });
}

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles()
.then(data=>{
    res.status(200).send({articles: data});
})
.catch((err)=>{
    next(err);
})
}

exports.getCommentsById = (req, res, next) => {
    const {article_id} = req.params;

    fetchCommentsById(article_id)
    .then(data=>{
        res.status(200).send({comments: data});
    })
    .catch((err)=>{
        next(err);
    })

}