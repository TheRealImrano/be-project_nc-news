const { fetchArticles, fetchAllArticles, fetchCommentsById, createComment, updateArticle } = require("../models/articleModel");

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

exports.postComment = (req, res, next) => {
    const {article_id} = req.params;
    const body = req.body;

    createComment(article_id, body)
    .then(data=>{
        res.status(201).send({comment: data});
    })
    .catch((err)=>{
        next(err);
    })
}

exports.patchArticle = (req, res, next) => {
    const {article_id} = req.params;
    const voteCount = req.body;

    updateArticle(article_id, voteCount)
    .then(data=>{
        res.status(201).send({article: data});
    })
    .catch((err)=>{
        next(err);
    })
}