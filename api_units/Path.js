let Method = require("./Method");

/**
 * @class
 * @classdesc definition
 * */
class Path{

    /**
     * @constructor
     * @param {String} path - path without forward-slash
     * @param {Swagger} openAPI - Swagger object
     * */
    constructor(path, openAPI){
        this.path = path;
        this.openAPI = openAPI;
        this.methods = [];
    }

    /**
     * @function
     * @instance
     * @param {String} method_name - name of the method. All http openAPI methods supported
     * @param {Array<Object>} inputs - input params for request
     * @param {Entity} entity - entity instance for which this path is being created
     * @returns {Method} method instance
     * */
    addMethod(method_name, inputs, entity){
        let method = new Method(this, method_name, inputs, entity, this.openAPI);
        this.methods.push(method);
        return method;
    }

    /**
     * @function
     * @instance
     * @description serializes methods's
     * @returns {Object} methods json object
     * */
    serializeMethods(){
        let serialized_methods = {};
        for(let method of this.methods){
            Object.assign(serialized_methods, method.serialize());
        }
        return serialized_methods;
    }

    /**
     * @function
     * @instance
     * @description serializes stuff
     * */
    serialize(){
        return {
            ["/"+this.path]: this.serializeMethods()
        };
    }

}

module.exports = Path;