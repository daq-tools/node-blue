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
- [o] JS: NPM linking
- [o] JS: No waiting. Use events instead.
- [o] JS: ES6 modules.

## Iteration +2
- [o] Flow templating? => Environment variables.
- [o] Production-like snippets, using environment variables
  - https://nodered.org/docs/user-guide/environment-variables
  - https://flowforge.com/blog/2023/01/environment-variables-in-node-red/
- [o] node-blue launch --flow=https://community.crate.io/uploads/short-url/vWxIENgDPhYnoTZuQC7DKJoNdyY.json
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


## Done
- [x] Minimize flow JSON
- [x] Python-based flow manager and provider
- [x] Naming things: `Context` -> `NodeBlueContext`
- [x] Proper parameter juggling: flow, host, port
- [x] Add some "logging" node to a flow recipe example
- [x] Read flows written in JSON5 and YAML, with inline comments
- [x] Add MQTT imperial -> metric example for JSON5 and YAML
