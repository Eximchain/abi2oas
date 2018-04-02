class Swagger {

    /**
     * @constructor
     * @param {Info} info - API info
     * @param {Object} [misc_info={}] - configuration loaded from file
     * @param {Array<Path>} [paths=[]]
     * @param {Array<Definition>} [definitions=[]]
     * @param {Array<Tag>} [tags=[]]
     * @param {String} [swagger_version="2.0"] - swagger version
     * */
    constructor(info, misc_info={}, paths=[], definitions=[], tags=[], swagger_version="2.0"){
        this.info = info;
        this.paths = paths;
        this.definitions = definitions;
        this.tags = tags;
        this.swagger_version = swagger_version;
        this.misc_info = misc_info;
    }

    /**
     * @function
     * @instance
     * @param {Definition} definition - add a definition to the swagger object
     * */
    addDefinition(definition){
        this.definitions.push(definition);
    }

    /**
     * @function
     * @instance
     * @param {Path} path - add a new path to the swagger object
     * */
    addPath(path){
        this.paths.push(path);
    }

    /**
     * @function
     * @instance
     * @param {Tag} tag - add a tag to the swagger object
     * */
    addTag(tag){
        this.tags.push(tag);
    }

    /**
     * @function
     * @instance
     * @param {Tag} tag - tag for which paths are required
     * @returns {Array<Method>} list of method objects
     * */
    getMethodsForTag(tag){
        let required_methods = [];
        for(let path of this.paths){
            for(let method of path.methods){
                if(method.tag_names.indexOf(tag.name)!==-1){
                    required_methods.push(method);
                }
            }
        }
        return required_methods;
    }

    /**
     * @function
     * @instance
     * @description serializes Definitions
     * @returns {Object}
     * */
    serializeDefinitions(){
        let serialized_definitions = {};
        for(let definition of this.definitions){
            Object.assign(serialized_definitions, definition.serialize());
        }
        return serialized_definitions;
    }

    /**
     * @function
     * @instance
     * @description serializes Paths
     * @returns {Object}
     * */
    serializePaths(){
        let serialized_paths = {};
        for(let path of this.paths){
            Object.assign(serialized_paths, path.serialize());
        }
        return serialized_paths;
    }

    /**
     * @function
     * @instance
     * @description serializes Tags
     * @returns {Object}
     * */
    serializeTags(){
        return this.tags.map(tag => tag.serialize());
    }

    /**
     * @function
     * @instance
     * @description serializes stuff
     * */
    serialize(){
        return {
            swagger: this.swagger_version,
            info: this.info.serialize(),
            tags: this.serializeTags(),
            paths: this.serializePaths(),
            definitions: this.serializeDefinitions(),
            schemes: this.misc_info.schemes,
            host: this.misc_info.host,
            basePath: this.misc_info.basePath
        };
    }

}

module.exports = Swagger;