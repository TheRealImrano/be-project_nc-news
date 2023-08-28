const express = require("express");
const { getTopics } = require("./controllers/topicsController");
const { getEndpoints } = require("./controllers/apiController");
const { getArticles, getAllArticles, getCommentsById, postComment } = require("./controllers/articleController");


const app = express();
app.use(express.json());

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticles);
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id/comments', getCommentsById)
app.post('/api/articles/:article_id/comments', postComment)

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({
      msg: "Bad Request",
      code: 400
    });
  } else next(err);
})

app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg, code: err.status });
    } else next(err);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Internal Server Error" });
});

module.exports = app;