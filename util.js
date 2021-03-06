const path = require('path');
const fs = require('fs');

const isString = thing => typeof thing === 'string';

const isJSONFile = thing => path.extname(thing).toLowerCase() === '.json';

const paddedLog = (msg) =>{
    console.log("");
    if (isString(msg)) {
        console.log(msg);
    } else if (Array.isArray(msg)){
        msg.forEach(item => console.log(item))
    }
    console.log("");
};

const errorClose = (msg) => {
    let errorMsg = `Error: ${msg}  Run "abi2oas --help" to see command syntax, or view the README on the GitHub repo.`
    paddedLog(errorMsg)
    return new Error(errorMsg);
};

module.exports = {
    isString : isString,
    isJSONFile : isJSONFile,
    errorClose : errorClose,
    paddedLog : paddedLog
}