const { fetchTopics } = require("../models/topicsModel")


exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((data)=>{
        res.status(200).send({topics: data.rows});
    })
    .catch((err) => {
        console.log(err.code)
        next(err);
    });
}