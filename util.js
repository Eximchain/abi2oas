module.exports = {
    isString : thing => typeof thing === 'string',
    isJSONFile : thing => path.extname(thing).toLowerCase() === '.json',
    isWritable : dirname => fs.access(dirname, fs.constants.W_OK, err => !!err ),
    errorClose : (msg) => {
        let errorMsg = `Error: ${msg}  Run "abi2oas --help" to see command syntax, or view the README on the GitHub repo.`
        console.log("");
        console.error(errorMsg);
        console.log("");
        return new Error(errorMsg);
    }
}