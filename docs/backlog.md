# Node-BLUE backlog 

## Iteration +1
- [o] What about calling Python functions?
- [o] Python functions, appsource, and appsink
- [o] Hot configuration and code reloading
- [o] Manage multiple flows
  - Load flows from directory
  - Maybe use `node-red-contrib-flow-manager`? Thanks, @eseunghwan.
    -- https://github.com/oyajiDev/NodeRED.py/blob/master/noderedpy/node-red-starter/package.json
- [o] Tabs
  ```
  {
    "id": "a66a83a71c8e56d0",
    "type": "tab",
    "label": "Flow 1",
    "disabled": false,
    "info": "",
    "env": []
  } 
  ```
- [o] Automatic assignment of `id`, `x`, and `y` field values, when empty
- [o] Support for Node-RED's original `settings.js`
- [o] Cosmetics: Uppercase `RED` again, in JavaScript.
- [o] Cosmetics: Remove semicolons, in JavaScript.
- [o] Convert `blue.js` to ES6 module `blue.mjs`
- [o] JS: Get rid of `red` global again
- [o] JS: NPM linking of `node_blue` and `droste` code into the embedded `node_modules` directory
  Then, get rid of `node.importmap` and `__CONTAINER_PATHS__` again.
- [o] JS: No waiting. Use events instead. How to discover all available ones?
- [o] JS: ES6 modules.
- [o] Python: Add tests for all variants of valid and invalid user-defined function
  invocations, with and without function signature
- [o] UI representation for Python UDFs
- [o] Only boot into `node-red.runtime`?
- [o] Serve static HTML splash screen from `web` or `public` directory
- [o] Spec: https://nodered.org/docs/user-guide/writing-functions
- [o] Log format? https://nodered.org/docs/user-guide/runtime/logging
- [o] JSON5 and YAML format support for `settings.json`
- [o] Test suite fails on Windows
  - `Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only URLs with a scheme in: file and data are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'd:'`
  - https://github.com/daq-tools/node-blue/actions/runs/5130333171/jobs/9228981464?pr=2#step:8:524

## Iteration +2
- [o] Flow templating? => Environment variables.
- [o] Production-like snippets, using environment variables
  - https://nodered.org/docs/user-guide/environment-variables
  - https://flowforge.com/blog/2023/01/environment-variables-in-node-red/
- [o] node-blue launch --flow=https://community.crate.io/uploads/short-url/vWxIENgDPhYnoTZuQC7DKJoNdyY.json
  - Needs additional flows: postgresql, postgreSQLConfig
- [o] What about projects?
- [o] Improve HAL with synthetic module loader from mqttwarn
- [o] Load flows from HTTP
- [o] Load flows from git repository
- [o] Load flows from https://flows.nodered.org/

## Iteration +3
- [o] Launch with Python only
- [o] Move "node summary" to separate command, e.g. `node-blue list-nodes`
- [o] Use `red.nodes.loadFlows()` API to load one or multiple flows?
- [o] Pin versions of packages: express, node-red, http-shutdown?
- [o] Different pipeline notations?
- [o] Mermaid syntax?
- [o] Inline MQTT broker
  - legacy: node-red-contrib-mqtt-broker
  - modern: Aedes
    - https://flows.nodered.org/node/node-red-contrib-aedes
    - https://github.com/moscajs/aedes/blob/main/docs/Examples.md#simple-plain-mqtt-server
- [o] Node-RED Dashboard
  - https://knolleary.net/node-red-workshop-photobooth/part2/
- [o] Airflow within Node-RED?
- [o] https://nodered.org/docs/user-guide/runtime/securing-node-red
- https://github.com/naimo84/awesome-nodered
- UI: https://flows.nodered.org/collection/590bc13ff3a5f005c7d2189bbb563976
- Timers
  - https://github.com/scargill/node-red-contrib-bigtimer
  - https://tech.scargill.net/big-timer/
  - https://github.com/node-red/node-red-nodes/tree/master/time/timeswitch
  - https://flows.nodered.org/node/node-red-contrib-cron-plus
- PLCs?
  - https://github.com/Steve-Mcl/node-red-contrib-omron-fins
  - https://github.com/Steve-Mcl/node-red-contrib-mcprotocol
- High-quality community nodes
  - https://github.com/Steve-Mcl/node-red-contrib-image-tools
  - https://github.com/Steveorevo/node-red-contrib-actionflows
  - https://github.com/Anamico/node-red-contrib-alarm
  - https://github.com/hardillb/node-red-contrib-owntracks
  - https://www.hardill.me.uk/wordpress/2016/04/26/owntracks-encrypted-location-node-red-node/

## Done
- [x] Minimize flow JSON
- [x] Python-based flow manager and provider
- [x] Naming things: `Context` -> `NodeBlueContext`
- [x] Proper parameter juggling: flow, host, port
- [x] Add some "logging" node to a flow recipe example
- [x] Read flows written in JSON5 and YAML, with inline comments
- [x] Add MQTT imperial -> metric example for JSON5 and YAML
