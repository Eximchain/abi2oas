/**
 * @class
 * @classdesc license information class
 * */
class License{

    /**
     * @constructor
     * @param {String} name
     * @param {String} url - license location URL
     * */
    constructor(name, url){
        this.name = name;
        this.url = url;
    }

    /**
     * @function
     * @instance
     * @description serializes stuff
     * */
    serialize(){
        return {
            name: this.name,
            url: this.url
        };
    }

}

module.exports = License;