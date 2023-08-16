const fs = require('fs/promises');

exports.readJsonFile = (filePath) => {
    return fs.readFile(filePath, 'utf-8')
        .then(jsonData => JSON.parse(jsonData))
        .catch(err => {
            return Promise.reject({
                status: 500,
                message: 'Error reading JSON file',
            });
        });
}