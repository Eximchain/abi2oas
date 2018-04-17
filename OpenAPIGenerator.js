let fs = require("fs");
let path = require("path");

let License = require("./api_units/License");
let Info = require("./api_units/Info");
let Entity = require("./api_units/Entity");
let Swagger = require("./api_units/Swagger");
let Tag = require("./api_units/Tag");
let Definition = require("./api_units/Definition");
let Property = require("./api_units/Property");

const { isJSONFile, isString, errorClose, paddedLog } = require('./util');

/**
 * @class
 * @classdesc Parser class that actually parses and generates OpenAPI config
 * */
class OpenAPIGenerator {

    /**
     * @constructor
     * @description
     * @param {Object|String} config Either an object following the config spec, or the string path to a corresponding JSON.
     * Reads the contract metadata which is built using truffle migrate and stores the schema.
     * */
    constructor(contract_path, config={}) {
        this.config = typeof config === 'string' ? 
            JSON.parse(fs.readFileSync(config)) : config;
        this.contract = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), contract_path)));
    }

    /**
     * @function
     * @instance
     * @description Creates license, info objects and also openAPI instance
     * */
    init() {
        let license = new License("Apache 2.0", "http://www.apache.org/licenses/LICENSE-2.0.html");
        let info = new Info(
            this.contract.contractName, 
            this.contract.contractName, 
            license, 
            this.config.version || '1.0.0'
        );
        this.openAPI = new Swagger(info, {
            schemes: this.config.schemes || ["https"],
            host: this.config.host || "localhost:8080",
            basePath: this.config.basePath || "/"
        });
    }

    /**
     * @function
     * @instance
     * @description generate's default definitions for eth
     * */
    buildDefaultDefinitions(){
        //Address as a basic definition
        this.openAPI.addDefinition(new Definition("address", "string"));
        this.openAPI.addDefinition(new Definition("receipt", "object", [
            new Property({name:"hash", type:"string"})
        ]));

        /*
        transaction receipt schema...
        =============================
        *   transactionHash: string
            transactionIndex: number
            blockHash: string
            blockNumber: number
            from: string
            to: string
            contractAddress: string
            cumulativeGasUsed: number
            gasUsed: number
            logs?: Array<Log>
            events?: {
                [eventName: string]: EventLog
            }
        */
    }

    /**
     * @function
     * @instance
     * @description Consumes config file and ABI to add data to openAPI object
     * */
    process() {
        this.buildDefaultDefinitions();
        if (this.config.tags){
            this.config.tags.forEach((tag) => {
                this.openAPI.addTag(new Tag(tag.name, tag.description));
            })
        }
        for ( let entity of this.contract.abi ) {
            new Entity(entity, this.config, this.openAPI);
        }
    }

    /**
     * @function
     * @instance
     * @param {String} [file_path=undefined] - path of output file
     * @description Serializes openAPI object to provided file path, or writes it to the console and then returns it.
     * */
    build(file_path) {
        let openAPIObj = this.openAPI.serialize();
        let openAPIStr = JSON.stringify(openAPIObj, null, 4)
        if(file_path){
            // TODO: Add safety check to make sure output directory exists
            fs.writeFileSync(file_path, openAPIStr);
        }else{
            console.log(openAPIStr);
        }
        paddedLog(`Successfully generated OpenAPI JSON for contract "${openAPIObj.info.title}", view result at "${path.resolve(process.cwd(), file_path)}"`);
        return openAPIObj;
    }

   /**
     * @function
     * @static
     * @param {Object|String} config Object corresponding to config spec, or string path to a config JSON's location.
     * @param {String} [file_path=undefined] - Path for output file
     * @description Given 
     * */
    static convert(contract_path, file_path, config={}){
        if (isString(config)){
            if (!fs.existsSync(config)) return errorClose(`Specified config file "${config}" does not exist.`)
            if (!isJSONFile(config)) return errorClose(`Specified config file "${config}" is not a JSON file.`)
        }
        if (!isString(contract_path)) return errorClose(`Specified contract_path was not a string: ${contract_path}`);
        if (!isJSONFile(contract_path)) return errorClose(`Specified contract_path is not a valid JSON filename: ${contract_path}`);
        if (!fs.existsSync(contract_path)) return errorClose(`Specified contract_path does not point to an existing file: ${contract_path}`);
        if (!isString(file_path)) return errorClose("Provided output path was not a string.");
        if (!isJSONFile(file_path)) return errorClose(`Specified output file "${file_path}" is not a JSON file.`)

        let generator = new OpenAPIGenerator(contract_path, config);
        generator.init();
        generator.process();
        return generator.build(file_path);
    }

}

module.exports = OpenAPIGenerator;