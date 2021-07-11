const path = 'data.json';
const fs = require('fs')

function getData(){
    const data = JSON.parse(fs.readFileSync(path));
        return data;
}

function save(arquivo){
    const nData = JSON.stringify(arquivo);
    fs.writeFileSync(path,nData)
}

module.exports = {
    getData, save
}