const fs = require('fs/promises');

function readJsonFile() {
    return fs.readFile('./endpoints.json', 'utf-8')
        .then(jsonData => JSON.parse(jsonData))
        .catch(error => {
            console.error('Error reading JSON file:', error);
            throw error;
        });
}