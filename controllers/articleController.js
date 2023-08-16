const { fetchArticles } = require("../models/articleModel");

exports.getArticles = (req, res, next) => {
    const {article_id} = req.params;

    fetchArticles(article_id)
}