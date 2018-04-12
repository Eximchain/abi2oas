#!/usr/bin/env node

const OpenAPIGenerator = require('./OpenAPIGenerator');
const fs = require("fs");
const program = require('commander');

program
    .version('0.0.3')
    .description("Autogenerate an Open API JSON corresponding to the functions in a smart contract's ABI.")
    .usage('Call with the paths to your config file and your desired output file.')
    .arguments('<config_file> <output_file>')
    .action((config_file, output_file) => {
        let generatedAPI = OpenAPIGenerator.convert(config_file, output_file);
        console.log(`Completed generating OpenAPI JSON for ${generatedAPI.info.title}, output is in ${output_file}`);
    })

program.on('--help', () => {
    console.log('  For more information about configuration and generation, view the abi2oas homepage on GitHub.');
});  

if (require.main === module) {
    program.parse(argv)
} else {
    module.exports = OpenAPIGenerator;
}
