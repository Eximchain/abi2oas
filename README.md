# abi2oas

Ingests a smart contract's [ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html) and autogenerates a JSON conforming to the [OpenAPI Spec](https://swagger.io/specification/), ready for [Swagger Codegen](https://swagger.io/swagger-codegen/).

## Usage
### CLI
Install globally via `npm`, `yarn`, or your preferred Javascript package manager:

```
npm install -g abi2oas

yarn global add abi2oas
```

Use in your terminal of choice by running:

```
abi2oas <path_to_config.json> <path_to_output.json>
```

If you are on Windows, you might need to refresh your path by restarting the terminal.

### Node.js
You can also use `abi2oas` directly within node.  Install directly to your project:

```
npm install --save abi2oas

// OR

yarn add abi2oas
```

Import like any other package, then use the `convert` method to build the OpenAPI object:

```javascript
const abi2oas = require('abi2oas');

const contractApiSpec = abi2oas.convert(<path_to_contract.json>, <output_path.json>, [config]);
```
`.convert()` runs synchronously and returns the serialized object corresponding to the OpenAPI JSON.  `config` in this method may either be an object or a string pointing to a config JSON.  Read below for config spec.

## Method Mapping
The smart contract is mapped to the OpenAPI spec on a per-function basis:  

- Each function's name becomes an API path (e.g. `whitelistAddress` function yields `/whitelistAddress` path).  If the function is `constant`, then its path accepts GET requests.  Otherwise, it accepts POST requests.
- A tag is automatically generated for each function, representing its dynamic scope (e.g. a `whitelistAddressScope` tag).  All methods for each function automatically have its tag, along with any other custom tags specified in the config.
- Definitions are automatically generated for each function-method's params and response (e.g. `whitelistAddress_post_params` & `whitelistAddress_post_params_response`), as well as definitions for receipts and basic types.

## Config
The config JSON includes the path to the contract, ethereum options, and swagger options.

```
{
  "version": "1.0.0", // optional, "1.0.0" is default
  "schemes": ["https"], // optional, ["https"] is default
  "host": "localhost:8080", // optional, "localhost:8080" is default
  "basePath": "/", // optional, '/' is default
  "tags": [ // Optional custom tags...],
  "api": { // Optional, add tags to methods; see below }
}
```
Config must be valid JSON, comments only included for illustrative purposes.

### Custom Tags
You can specify additional tags using the `tags` key.  

```
{ ...,
  "tags" : [
    {
      "name": "admin",
      "description": "Only admin access"
    },
  ...]
}
```

Custom tags can be attached per-endpoint and per-method using the `api` key.  For instance, if you wanted to tag the POST method for contract function `"whitelistAddress"` with `"admin"`, for instance, your config file would include:

```
{ ...,
  "tags" : { // above }
  "api" : {
    "whitelistAddress" : {
      "post" : {
        "tags" : ["admin"]
      }
    }
  }
}
```

## Roadmap
### Short-Term
-[x] Fix autogen to use GET or POST based on whether the function is `constant`, not whether it has inputs or outputs.
-[x] User-friendly CLI interaction via commander
-[x] Check that the static `convert` method is working when imported to another npm package.
-[] Add default definitions for Ethereum primitive types other than address & receipt
-[] Write tests for a variety of contracts

### Long-Term
-[] Event Support

## Licensing
abi2oas is developed & maintained by [Eximchain](https://eximchain.com/), released for public use under the Apache-2.0 License.

Output from abi2oas is configured by default to use the same license.