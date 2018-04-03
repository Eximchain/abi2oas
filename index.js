#!/usr/bin/env node

let fs = require("fs");
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
     * Read's the contract schema which is built using truffle migrate and stores the schema.
     * */
    constructor(config_file) {
        "use strict";
        this.config = JSON.parse(fs.readFileSync(config_file));
        this.cs = JSON.parse(fs.readFileSync((this.config.contract)));    //cs = contract_schema
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
     * @description handle's reading the data loaded from file and creating objects
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
     * @description Writes the serialized json data to provided file path. Else writes the output to console...
     * */
    build(file_path) {
        if(file_path){
            fs.writeFileSync(file_path, JSON.stringify(this.openAPI.serialize(), null, 4));
        }else{
            console.log(JSON.stringify(this.openAPI.serialize(), null, 4));
        }
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
