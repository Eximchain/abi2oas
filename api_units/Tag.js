/**
 * @class
 * @classdesc Tag class
 * */
class Tag{

    /**
     * @constructor
     * @param {String} name - tag name
     * @param {String} description - description
     * */
    constructor(name, description){
        this.name = name;
        this.description = description;
    }

    /**
     * @function
     * @instance
     * @description serializes stuff
     * */
    serialize(){
        return {
            name: this.name,
            description: this.description
        };
    }

}

module.exports = Tag;