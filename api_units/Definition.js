/**
 * @class
 * @classdesc Custom definitions can be handled as an object
 * */
class Definition{

    /**
     * @constructor
     * @param {String} name - definition name
     * @param {String} type - definition type
     * @param {Array<Property>} [properties=null] - properties are required if type==="object"
     * */
    constructor(name, type, properties){
        this.name = name;
        this.type = type;
        if(type==="object"){
            this.properties = properties;
        }
    }

    /**
     * @function
     * @instance
     * @description serializes definition properties
     * @returns {Object}
     * */
    serializeProperties(){
        let serialized_properties = {};
        for(let property of this.properties){
            Object.assign(serialized_properties, property.serialize());
        }
        return serialized_properties;
    }

    /**
     * @function
     * @instance
     * @description serializes stuff
     * */
    serialize(){
        let json = {};
        json[this.name] = {
            type: this.type
        };
        if(this.properties){
            json[this.name].properties = this.serializeProperties();
        }
        return json;
    }

}


module.exports = Definition;