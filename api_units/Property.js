/**
 * @class
 * @classdesc property class. A property is property of a definition.
 * */
class Property{

    /**
     * @constructor
     * @instance
     * @param {Object} property - property json
     * @param {String} [property.name=property.type] - name of the property
     * @param {String} property.type - type of property. can be anything.
     * */
    constructor(property){
        this.name = property.name || property.type;
        /*
        * Data types from solidity
        *
        * uint8-256: 8 to 256-bit unsigned integer, operable with bitwise and unsigned arithmetic operations.
        * int8-256: 8 to 256-bit signed integer, operable with bitwise and signed arithmetic operations.
        * string, bytes1 to bytes32: zero-terminated ASCII string of maximum length 0 to 32-bytes or more.
        * address: account identifier, similar to a 160-bit hash type.
        * bool: two-state value.
        * */
        if(property.type === "address") {
            this.$ref = "address";
        }else if(property.type === "receipt"){
                this.$ref = "receipt";
        }else if(property.type === "string" || property.type.startsWith("bytes")){
            this.type = "string"
        }else if(property.type.startsWith("int") || property.type.startsWith("uint")){
            this.type = "number";
        }else if(property.type === "bool"){
            this.type = "boolean";
        }else{
            this.type = property.type;
        }
    }

    /**
     * @function
     * @instance
     * @description serializes stuff
     * */
    serialize(){
        let json = {};
        json[this.name] = {};
        if(this.$ref){
            json[this.name].$ref = "#/definitions/"+this.$ref;
        }else{
            json[this.name].type = this.type;
        }
        return json;
    }

}
module.exports = Property;
