/**
 * @class
 * @classdesc Info class for openAPI
 * */
class Info{

    /**
     * @constructor
     * @param {String} title - API name
     * @param {String} description - API description
     * @param {License} license - license object for the API
     * @param {String} [version="1.0.0"] - API version
     * */
    constructor(title, description, license, version="1.0.0"){
        this.title = title;
        this.description = description;
        this.license = license;
        this.version = version;
    }

    /**
     * @function
     * @instance
     * @description serializes stuff
     * */
    serialize(){
        return {
            title: this.title,
            description: this.description,
            version: this.version,
            license: this.license.serialize()
        }
    }


}

module.exports = Info;
