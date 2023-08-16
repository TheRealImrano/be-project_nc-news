const fs = require('fs/promises');

exports.fetchEndpoints = (filePath) => {
    return fs.readFile(filePath, 'utf-8')
        .then(jsonData => {
            return JSON.parse(jsonData);
        })
}