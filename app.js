const express = require("express");
const { getTopics } = require("./controllers/topicsController");
const { getEndpoints } = require("./controllers/apiController");
const { getArticles, getAllArticles } = require("./controllers/articleController");


const app = express();

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticles);
app.get('/api/articles', getAllArticles)

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({
      msg: "Bad Request",
      code: 400
    });
  };
  next(err);
})

app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });

app.use((err, req, res, next) => {
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;