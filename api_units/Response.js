/**
 * @class
 * @classdesc Response object
 * */
class Response{

    /**
     * @constructor
     * @param {Number} response_code - response code
     * @param {Array<Object>} outputs - response body schema
     * @param {String} description - description of response
     * */
    constructor(response_code, outputs, description){
        this.response_code = response_code;
        this.outputs = outputs;
        this.schema = null;
        this.description = description || (response_code===200?"success":(response_code===400?"error":null));
    }

    /**
     * @function
     * @description getter method for outputs
     * @returns {Array<Object>}
     * */
    getOutputs(){
        return this.outputs;
    }

    /**
     * @function
     * @instance
     * @param {String} definition_name - name of the definition which the response object's output refers to
     * */
    setSchema(definition_name){
        this.schema = {
            "$ref" : "#/definitions/"+definition_name
        };
    }

    /**
     * @function
     * @instance
     * @description serializes stuff
     * */
    serialize(){
        let json = {};
        json[this.response_code] = {
            "description": this.description,
        };
        if(this.schema){
            json[this.response_code].schema = this.schema;
        }
        return json;
    }
}
module.exports = Response;
