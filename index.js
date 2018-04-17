#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const package = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json')));
const OpenAPIGenerator = require('./OpenAPIGenerator');
const program = require('commander');

const { errorClose, paddedLog } = require('./util');

program
    .version(package.version)
    .name(package.name)
    .description(package.description)
    .usage('<contract_file_path> <output_file_path>')
    .option('-C, --config <config_path>', 'Specify path to config.json from current working directory.  If other options are also specified, they will override values in file.')
    .option('-v, --apiVersion <version>', 'Specify a version for your new API; defaults to 1.0.0.')
    .option('-h, --host <host>', 'Specify a hostname for your new OpenAPI; defaults to "localhost:8080"')
    .option('-b, --base <base>', 'Specify a base path for your new OpenAPI; defaults to "/" .')
    .option('-s, --schemes <schemes...>', 'Specify default schemes as a comma-separated list, no spaces; defaults to "https".', str => str.split(','))
    .action((contract_file, output_file, options) => {
        let config = {};
        if (options.config) config = JSON.parse(fs.readFileSync(options.config));
        if (options.apiVersion) config.version = options.apiVersion;
        if (options.host) config.host = options.host;
        if (options.base) config.basePath = options.base;
        if (options.schemes) config.schemes = options.schemes;
        return OpenAPIGenerator.convert(contract_file, output_file, config);
    })

program.on('--help', () => {
    paddedLog([
        '  Both paths should be relative to the current working directory.',
        '  Any options specified in command will override values in a specified config file.',
        '  For more information about configuration and generation, view the abi2oas homepage on GitHub.'
    ]);
});  

if (require.main === module) {
    if (process.argv.length === 2) program.help();
    program.parse(process.argv);
} else {
    module.exports = OpenAPIGenerator;
}
