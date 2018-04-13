#!/usr/bin/env node
const fs = require('fs');
const package = JSON.parse(fs.readFileSync('./package.json'));
const OpenAPIGenerator = require('./OpenAPIGenerator');
const program = require('commander');

const { errorClose, paddedLog } = require('./util');

program
    .version(package.version)
    .name(package.name)
    .description(package.description)
    .usage('<config_file_path> <output_file_path>')
    .action((config_file, output_file) => {
        return OpenAPIGenerator.convert(config_file, output_file);
    })

program.on('--help', () => {
    paddedLog('  Both paths should be relative to the current working directory.  For more information about configuration and generation, view the abi2oas homepage on GitHub.');
});  

if (require.main === module) {
    if (process.argv.length === 2) program.help();
    program.parse(process.argv);
} else {
    module.exports = OpenAPIGenerator;
}
