#!/usr/bin/env node

const OpenAPIGenerator = require('./OpenAPIGenerator');
const fs = require('fs');
const path = require('path');
const program = require('commander');

const { errorClose } = require('./util');

program
    .version('0.0.4')
    .name('abi2oas')
    .description("Autogenerate an Open API JSON corresponding to the functions in a smart contract's ABI.  \n  Call with the paths to your config file and your desired OpenAPI output file.")
    .usage('<config_file_path> <output_file_path>')
    .action((config_file, output_file) => {
        return OpenAPIGenerator.convert(config_file, output_file);
    })

program.on('--help', () => {
    console.log('');
    console.log('  For more information about configuration and generation, view the abi2oas homepage on GitHub.');
    console.log('');
});  

if (require.main === module) {
    let args = process.argv;
    if (args.length-1 !== 2) return errorClose(`abi2oas requires 2 arguments, not ${args.length - 1}.`)
    program.parse(args);
} else {
    module.exports = OpenAPIGenerator;
}
