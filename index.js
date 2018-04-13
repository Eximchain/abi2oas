#!/usr/bin/env node

const OpenAPIGenerator = require('./OpenAPIGenerator');
const program = require('commander');

const { errorClose, paddedLog } = require('./util');

program
    .version('0.0.7')
    .name('abi2oas')
    .description("Autogenerate an Open API JSON corresponding to the functions in a smart contract's ABI.  \n  Call with the paths to your config file and your desired OpenAPI output file.")
    .usage('<config_file_path> <output_file_path>')
    .action((config_file, output_file) => {
        return OpenAPIGenerator.convert(config_file, output_file);
    })

program.on('--help', () => {
    paddedLog('  For more information about configuration and generation, view the abi2oas homepage on GitHub.');
});  

if (require.main === module) {
    if (!process.args || process.args.length !== 2) return errorClose(`abi2oas CLI called with incorrect number of args; it takes 2.`);
    program.parse(process.argv);
} else {
    module.exports = OpenAPIGenerator;
}
