# abi2oas
Ingests a smart contract's ABI and autogenerates OpenAPI JSON, ready for Swagger codegen.

## Usage
### CLI
Install globally via `npm`, `yarn`, or your preferred Javascript package manager:

```
npm install -g abi2oas
```

Use in your terminal by running:

```
abi2oas <path_to_config.json> <path_to_output.json>
```

If you are on Windows, you might need to refresh your path by restarting the terminal.

### Node.js
You can also use abi2oas within a `nodejs` script
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
  "host": "localhost:8080", // optional, "localhost:8008" is default
  "basePath": "/", // optional, '/' is default
  "tags": [ // Optional custom tags...],
  "api": { // Optional, add tags to methods; see below }
}
```
Config must be valid JSON, comments only included for illustrative purposes.

### Custom Tags
If you would like to specify custom tags, you can connect those tags with the auto-generated methods using `api` key.  Tags must be specified per-endpoint and per-method.  For instance, if you wanted to tag the POST method for contract function `"whitelistAddress"` with `"admin"`, for instance, your config file would include:
```
{
  ...,
  "api" : {
    "whitelistAddress" : {
      "post" : {
        "tags" : ["admin"]
      }
    }
  },
  ...
}
```

## Method Mapping
The smart contract is mapped to the OpenAPI spec on a per-function basis.  

Each function's name becomes an API path.  If the function accepts inputs, then its path can accept POST requests.  If the function also returns outputs, then its path also accepts GET requests.  

A tag is automatically generated for each function, representing its dynamic scope.  All methods for each function automatically have its tag, along with any other custom tags specified in the config.

Definitions are automatically generated for each function-method's params and response (e.g. `whitelistAddress_post_params` & `whitelistAddress_post_params_response`), as well as two basic definitions for addresses and receipts:

```
{
  "address": {
    "type": "string"
  },
  "receipt": {
    "type": "object",
    "properties": {
        "hash": {
            "type": "string"
        }
    }
  }
}
```

## Licensing
abi2oas is developed & maintained by [Eximchain](https://eximchain.com/), released for public use under the Apache License.

Output from `abi2oas` is configured by default to use the same license.