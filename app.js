const express = require("express");
const { getTopics } = require("./controllers/topicsController");


const app = express();

app.get('/api/topics', getTopics)

app.use((err, req, res, next) => {
    console.log('server error');
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;