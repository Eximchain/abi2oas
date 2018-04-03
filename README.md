# abi2oas
Ingests a smart contract's ABI and autogenerates OpenAPI JSON, ready for Swagger codegen.

## Usage
### CLI
Install globally via `npm`, `yarn`, or your preferred Javascript package manager:

```
npm install -g abi2oas
```

Use in your terminal of choice by running:

```
abi2oas <path_to_config.json> <path_to_output.json>
```

If you are on Windows, you might need to refresh your path by restarting the terminal.

### Node.js
You can also use `abi2oas1` directly within node.  Install directly to your project:

```
npm install --save abi2oas
```

Import like any other package, then use `convert` method:
```nodejs
import abi2oas from 'abi2oas';

abi2oas.convert({
  // config values
  }, '<path_to_output.json>');
```

### Config
The config JSON includes the path to the contract, ethereum options, and swagger options.  

```
{
  "version": "1.0.0",
  "contract": "<path_to_your_contract.json>",
  "schemes": ["https"], // optional, ["https"] is default
  "host": "localhost:8080", // optional, "localhost:8080" is default
  "basePath": "/", // optional, '/' is default
  "tags": [ // Optional custom tags...],
  "api": { // Optional, add tags to methods; see below }
}
```
Config must be valid JSON, comments only included for illustrative purposes.

#### Custom Tags
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

## Method Mapping
The smart contract is mapped to the OpenAPI spec on a per-function basis.  

Each function's name becomes an API path.  If the function accepts inputs, then its path can accept POST requests.  If the function also returns outputs, then its path also accepts GET requests.  

A tag is automatically generated for each function, representing its dynamic scope.  All methods for each function automatically have its tag, along with any other custom tags specified in the config.

Definitions are automatically generated for each function-method's params and response (e.g. `whitelistAddress_post_params` & `whitelistAddress_post_params_response`), as well as definitions for receipts and basic types.

## Licensing
abi2oas is developed & maintained by [Eximchain](https://eximchain.com/), released for public use under the Apache-2.0 License.

Output from `abi2oas` is configured by default to use the same license.