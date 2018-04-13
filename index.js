#!/usr/bin/env node

const OpenAPIGenerator = require('./OpenAPIGenerator');
const fs = require('fs');
const path = require('path');
const program = require('commander');

const isString = thing => typeof thing === 'string';
const isJSONFile = thing => path.extname(thing).toLowerCase() === '.json';
const isWritable = dirname => fs.access(dirname, fs.constants.W_OK, err => !!err )
const errorClose = (msg) => {
    let errorMsg = `Error: ${msg}  Run "abi2oas --help" to see command syntax.`
    console.log("");
    console.error(errorMsg);
    console.log("");
    return new Error(errorMsg);
}

program
    .version('0.0.4')
    .name('abi2oas')
    .description("Autogenerate an Open API JSON corresponding to the functions in a smart contract's ABI.  \n  Call with the paths to your config file and your desired OpenAPI output file.")
    .usage('<config_file_path> <output_file_path>')
    .action((config_file, output_file) => {
        if (!fs.existsSync(config_file)) return errorClose(`Specified config file "${config_file}" does not exist.`)
        if (!isJSONFile(config_file)) return errorClose(`Specified config file "${config_file}" is not a JSON file.`)
        if (!isJSONFile(output_file)) return errorClose(`Specified output file "${output_file}" is not a JSON file.`)
        if (!isWritable(path.dirname(output_file))) return errorClose(`Specified output directory "${path.dirname(output_file)}" is not writable.`)

        let generatedAPI = OpenAPIGenerator.convert(config_file, output_file);
        console.log(`Completed generating OpenAPI JSON for ${generatedAPI.info.title}, output is in ${output_file}.`);        
    })

program.on('--help', () => {
    console.log('');
    console.log('  For more information about configuration and generation, view the abi2oas homepage on GitHub.');
    console.log('');
});  

if (require.main === module) {
    program.parse(process.argv)
} else {
    module.exports = OpenAPIGenerator;
}
