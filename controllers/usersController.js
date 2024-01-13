const { fetchUsers } = require("../models/usersModel");

exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((data)=>{
        res.status(200).send({users: data});
    })
    .catch((err) => {
        next(err);
    });
}