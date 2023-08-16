const express = require("express");
const { getTopics } = require("./controllers/topicsController");
const fs = require('fs/promises');


const app = express();
app.use(express.json());

app.get('/api', ()=>{
    
})

app.get('/api/topics', getTopics)


app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({
        msg: "bad request - invalid SQL",
        code: err.code
      })
    }
    next(err)
})

app.use((err, req, res, next) => {
    if (err.status) {
        console.log('client error');
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });

app.use((err, req, res, next) => {
    console.log('server error');
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;