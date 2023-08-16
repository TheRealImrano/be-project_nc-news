const { fetchArticles } = require("../models/articleModel");

exports.getArticles = (req, res, next) => {
    console.log(req.params);
}