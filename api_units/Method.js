let Definition = require("./Definition");
let Property = require("./Property");
let Response = require("./Response");

/**
 * @class
 * @classdesc definition
 * */
class Method{

    /**
     * @constructor
     * @param {Path} path - path object to which definition method is being added
     * @param {String} method - Any http methods supported by OpenAPI
     * @param {Array<Object>} input_params - json format input parameters
     * @param {Entity} entity - entity instance
     * @param {Swagger} openAPI - Swagger object
     * @param {Array<String>} [consumes=["application/json"]] - input content type
     * @param {Array<String>} [produces=["application/json"]] - output content type
     * */
    constructor(path, method, input_params, entity, openAPI, consumes=["application/json"], produces=["application/json"]){
        this.path = path;
        this.method = method;
        this.consumes = consumes;
        this.produces = produces;
        this.input_params = input_params;
        this.responses = [];
        this.tag_names = [];
        this.entity = entity;
        this.openAPI = openAPI;
        this.input_definition_name = this.generateDefinitions(input_params);
    }

    /**
     * @function
     * @instance
     * @param {Array<Object>} properties - input/output properties
     * @param {String} properties.name - name of the property
     * @param {String} properties.type - type of property. can be anything.
     * @param {Boolean} [is_response=false] - whener the defenition to be generated for input properties or response properties
     * @description generates definitions from properties
     * @returns {String} definition name
     * */
    generateDefinitions(properties, is_response=false){
        properties = JSON.parse(JSON.stringify(properties));
        let definition_name = this.path.path+"_"+this.method+"_params"+(is_response?"_response":"");
        if(is_response){
            if(this.method === "post"){
                properties = [
                    {
                        name: "receipt",
                        type: "receipt"
                    }
                ];
            }
        }else if(this.method === "post"){
            properties.push({
                name: "from",
                type: "address"
            });
            if(this.entity.isPayable()){
                properties.push({
                    name: "value",
                    type: "number"
                });
            }
        }
        /**
         * @member {Array<Property>}
         * */
        let property_objects = [];
        for (let one_property of properties){
            property_objects.push(new Property(one_property));
        }
        this.openAPI.addDefinition(new Definition(definition_name, "object", property_objects));
        return definition_name;
    }

    /**
     * @function
     * @instance
     * @param {Response} response - name of the tag that is to be added to the method
     * */
    addResponse(response){
        this.responses.push(response);
        if(response.response_code === 200){
            let definition_name = this.generateDefinitions(response.getOutputs(), true);
            response.setSchema(definition_name);
        }
    }

    /**
     * @function
     * @instance
     * @param {String} tag_name - name of the tag that is to be added to the method
     * */
    addTag(tag_name){
        this.tag_names.push(tag_name);
    }

    /**
     * @function
     * @instance
     * @description serializes response objects
     * @returns {Object}
     * */
    serializeResponses(){
        let serialized_responses = {};
        for(let response of this.responses){
            Object.assign(serialized_responses, response.serialize());
        }
        return serialized_responses;
    }

    /**
     * @function
     * @instance
     * @description serializes stuff
     * */
    serialize(){
        let path_config = {};
        if(this.input_params && this.input_params.length){
            path_config.consumes = this.consumes;
            let i_param = this.input_definition_name;
            path_config.parameters = [
                {
                    "in" : "body",
                    "name" : i_param,
                    "required" : true,
                    "schema" : {
                        "$ref" : "#/definitions/"+i_param
                    }
                }
            ];
        }
        return {
            [this.method]: Object.assign(path_config, {
                operationId: this.method+"_"+this.path.path,
                tags: this.tag_names,
                produces: this.produces,
                responses: this.serializeResponses()
            })
        };
    }

}

module.exports = Method;