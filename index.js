#!/usr/bin/env node

let fs = require("fs");
let path = require("path");

let License = require("./api_units/License");
let Info = require("./api_units/Info");
let Entity = require("./api_units/Entity");
let Swagger = require("./api_units/Swagger");
let Tag = require("./api_units/Tag");
let Definition = require("./api_units/Definition");
let Property = require("./api_units/Property");


/**
 * @class
 * @classdesc Parser class that actually parses and generates OpenAPI config
 * */
class OpenAPIGenerator {

    /**
     * @constructor
     * @description
     * @param {Object|String} config An object following the config spec, 
     * Read's the contract schema which is built using truffle migrate and stores the schema.
     * */
    constructor(config_file) {
        "use strict";
        // TODO: Let this accept eitiher string path to object or just the object itself.
        let config_path = path.dirname(config_file);
        this.config = JSON.parse(fs.readFileSync(config_file)); 

        // Use __dir instead of config_path in config_string case.
        let contract_path = path.resolve(config_path, this.config.contract);
        this.cs = JSON.parse(fs.readFileSync(contract_path));    //cs = contract_schema
    }

    /**
     * @function
     * @instance
     * @description Creates license, info objects and also openAPI instance
     * */
    init() {
        let license = new License("Apache 2.0", "http://www.apache.org/licenses/LICENSE-2.0.html");
        let info = new Info(this.cs.contractName, this.cs.contractName, license, this.config.version);
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
        for ( let entity of this.cs.abi ) {
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
        let abiObj = this.openAPI.serialize();
        if(file_path){
            fs.writeFileSync(file_path, JSON.stringify(abiObj, null, 4));
        }else{
            console.log(JSON.stringify(abiObj, null, 4));
            return abiObj;
        }
    }

   /**
     * TODO: Finish writing docs, verify this works when imported into abi2api
     * @function
     * @static
     * @param {Object|String} config Object corresponding to config spec, or string path to a config JSON's location.
     * @param {String} [file_path=undefined] - Path for output file
     * @description Given 
     * */
    static convert(config, file_path){
        let generator = new OpenAPIGenerator(config);
        generator.init();
        generator.process();
        return generator.build(file_path);
    }

}

if (require.main === module) {
    let generator = new OpenAPIGenerator(process.argv[2]);
    generator.init();
    generator.process();
    generator.build(process.argv[3]);
} else {
    module.exports = OpenAPIGenerator;
}
