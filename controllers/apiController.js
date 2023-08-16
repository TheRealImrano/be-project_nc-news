const { fetchEndpoints } = require("../models/apiModel");

exports.getEndpoints = (req, res, next) => {
        const filePath = './endpoints.json';

        fetchEndpoints(filePath)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            next(err);
        });
    }