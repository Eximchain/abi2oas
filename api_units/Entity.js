let Path = require("./Path");
let Tag = require("./Tag");
let Response = require("./Response");

/**
 * @class
 * @classdesc handles an entity related stuff... path's custom tag's etc.
 * */
class Entity{

    /**
     * @constructor
     * @param {Object} entity - entity as json
     * @param {Object} config object loaded from config file
     * @param {Swagger} openAPI - swagger object
     * */
    constructor(entity, config, openAPI){
        this.entity = JSON.parse(JSON.stringify(entity));
        this.openAPI = openAPI;
        this.config = config;
        this.process();
    }

    getName(){
        return this.entity.name;
    }

    /**
     * @function
     * @returns {Boolean} whether can process the current entity or not...
     * */
    can_process(){
        /**
         * Reference for ABI definition
         * =============================
         * interface ABIDefinition {
         * constant?: boolean
         * payable?: boolean
         * anonymous?: boolean
         * inputs?: Array<{ name: string, type: ABIDataTypes, indexed?: boolean }>
         * name?: string
         * outputs?: Array<{ name: string, type: ABIDataTypes }>
         * type: "function" | "constructor" | "event" | "fallback"
         * }
         * */
        return this.entity.type === "function"; //function
    }

    /**
     * @function
     * @instance
     * @description processes the entity and creates paths and tags
     * */
    process(){
        if(this.can_process()){
            this.createEntityTag();
            this.addPath();
            if(!this.getName()){
                console.log(this.getName());
                console.log(this.entity);
            }
        }
    }

    /**
     * @function
     * @instance
     * @description creates paths
     * */
    addPath(){
        this.path = new Path(this.getName(), this.openAPI);
        this.openAPI.addPath(this.path);
        this.addMethodsToPath();
    }

    /**
     * @function
     * @instance
     * @description adds HTTP methods to paths
     * */
    addMethodsToPath(){
        if(this.entity.inputs.length){
            let method = this.path.addMethod("post", this.entity.inputs, this);
            this.addResponsesToMethod(method);
            this.addTagsToMethod(method);
        }
        if(this.entity.outputs.length) {
            let get_method = this.path.addMethod("get", this.entity.inputs, this);
            this.addResponsesToMethod(get_method);
            this.addTagsToMethod(get_method);
        }
    }

    /**
     * @function
     * @instance
     * @description Adds default responses to a method
     * */
    addResponsesToMethod(method){
        method.addResponse(new Response(200, this.entity.outputs, "Success"));
        method.addResponse(new Response(400, null, "Error"));
    }

    /**
     * @function
     * @instance
     * @returns {String} custom tag name for current Entity
     * */
    getEntityTagName(){
        return this.getName()+"Scope";
    }

    /**
     * @function
     * @instance
     * @description Creates a custom tag and adds it to swagger object
     * */
    createEntityTag(){
        this.openAPI.addTag(new Tag(this.getEntityTagName(), "Dynamic Scope for "+this.getName()));
    }

    /**
     * @function
     * @instance
     * @param {Method} method - method object
     * */
    addTagsToMethod(method){
        method.addTag(this.getEntityTagName());
        try{
            for( let tag_name of this.config.api[this.getName()][method.method].tags){
                method.addTag(tag_name);
            }
        }catch(e){

        }
    }

    /**
     * @function
     * @returns {Boolean} whether the entity is payable or not
     * */
    isPayable(){
        return this.entity.payable;
    }

    /**
     * @function
     * @instance
     * @description serializes stuff
     * */
    serialize(){
        return this.path.serialize();
    }

}

module.exports = Entity;