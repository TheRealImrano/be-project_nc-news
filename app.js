const express = require("express");
const { getTopics } = require("./controllers/topicsController");
const fs = require('fs/promises');
const { readJsonFile } = require("./utils/jsonReader");


const app = express();
app.use(express.json());

app.get('/api', (req, res, next)=>{
    const filePath = './endpoints.json';

    readJsonFile(filePath)
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        next(err)
    });
});

app.get('/api/topics', getTopics)

app.use((err, req, res, next) => {
    if (err.status) {
        console.log(err.status, ':', err.message);
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });

app.use((err, req, res, next) => {
    console.log('server error');
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;