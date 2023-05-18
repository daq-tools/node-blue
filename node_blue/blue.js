/**
 * Node-BLUE main application. A minimal Node-RED JavaScript wrapper.
 *
 * Copyright (c) 2023, The Panodata developers and contributors.
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Distributed under the terms of the Apache-2.0 license, see LICENSE.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

/**
 *
 * Minimal Node-RED JavaScript bootloader.
 *
 * Derived from:
 * - https://nodered.org/docs/user-guide/runtime/embedding
 * - https://github.com/node-red/node-red/blob/master/packages/node_modules/node-red/red.js
 * - https://github.com/node-red/node-red/blob/master/packages/node_modules/node-red/lib/red.js
 * - https://github.com/oyajiDev/NodeRED.py/blob/master/noderedpy/node-red-starter/index.js
 *
**/


let __CONTAINER_PATHS__ = global["__CONTAINER_PATHS__"]
module.paths = module.paths.concat(__CONTAINER_PATHS__)

const python = require("pythonia");
const py = python.py;

// Import prerequisites.
const crypto = require("crypto");
const express = require("express");
const http = require("http");
const http_shutdown = require("http-shutdown");
const red = require("node-red");

// Express and Node-RED application / server instances.
const express_app = express();
const base_server = http.createServer(express_app);
const red_server = http_shutdown(base_server);


/**
 * An improved Node-RED shutdown function.
 */
red.shutdown = function() {
    red.log.info("HTTP server: Shutting down");
    red_server.shutdown(async function(err) {
        if (err) {
            red.log.info(`HTTP server: Shutdown failed. Reason: ${err}`);
        } else {
            red.log.info("HTTP server: Shutdown completed");
        }
        red.log.info("Node-RED: Shutting down");
        await red.stop();
        red.nodes.cleanModuleList();
        red.nodes.clearRegistry();
        red.log.info("Node-RED: Shutdown completed");
    });
}


function load_settings(path) {
    try {
        const settings = require(path)
        settings.settingsFile = path
        return settings
    } catch(err) {
        console.error(`Loading settings file failed: ${path}`)
        if (err.code == "MODULE_NOT_FOUND") {
            if (err.toString().indexOf(path) === -1) {
                console.error(err.toString())
            }
        } else {
            console.error(err)
        }
        process.exit(1)
    }
}


/**
 * Launch Node-RED.
 *
 * @param http_port
 * @param http_host
 * @returns {Promise<void>}
 */
async function launch_red(http_port, http_host) {

    red.log.info("minired: Starting")

    // Load Node-RED settings from file.
    const settings = load_settings("./settings.js")

    // Configure Node-RED context.
    red.init(red_server, settings);

    // Register Node-BLUE's extension types.
    await register_types();

    // Connect to Node-BLUE's flow provider.
    await connect_flow_provider();

    // Node-RED default routes.
    // TODO: Serve static `web` from directory within Python package.
    express_app.use("/", express.static("web"));
    express_app.use(red.settings.httpAdminRoot, red.httpAdmin);
    express_app.use(red.settings.httpNodeRoot, red.httpNode);

    // Start Node-RED.
    red.log.info(`minired: Starting HTTP admin interface at http://${http_host}:${http_port}${red.settings.httpAdminRoot}`)
    await red_server.listen(http_port, http_host)

    red.log.info("minired: Starting Node-RED")
    await red.start()
    red.log.info("minired: Node-RED started successfully")

    // let active_flows = await red.runtime.flows.getFlows({});
    // console.log("Active flows:", active_flows);

}


/**
 * Connect Node-RED to Node-BLUE's flow provider.
 *
 * @returns {Promise<void>}
 */
async function connect_flow_provider() {
    red.log.info("minired: Connecting Node-BLUE flow provider");

    // Request flows from Node-BLUE (Python).
    let blue_flows = [];
    if (typeof(blue) != "undefined" && typeof(blue.get_flows) == "function") {
        blue_flows = await (await blue.get_flows()).valueOf();
    }

    // Provide flows to Node-RED.
    // https://gitlab.com/monogoto.io/node-red-contrib-flow-manager/-/blob/0.7.4/flow-manager.js#L391-414
    red.runtime.storage.getFlows = async function () {
        const retVal = {
            flows: blue_flows,
            rev: calculateRevision(JSON.stringify(blue_flows)),
            credentials: {},
        };
        return retVal;
    };
}

/**
 * Register Node-RED type extensions.
 *
 * @returns {Promise<void>}
 */
async function register_types() {
    red.log.info("minired: Registering types");
    // TODO: `@node-loader/import-maps` does not work here.
    //       Will it be better after packaging `droste` as a real NPM?
    //       Otherwise, maybe refactor `blue.js` to ES6 module `blue.mjs`?
    // TODO: Improve after migration to ES6.
    const PythonFunctionNode = (await import("./udf_python.mjs")).PythonFunctionNode
    red.nodes.registerType("node-blue", "python-function", PythonFunctionNode);

}


/**
 * Compute digest to use as flow revision number.
 *
 * @param str
 * @returns {string}
 */
// https://gitlab.com/monogoto.io/node-red-contrib-flow-manager/-/blob/0.7.4/flow-manager.js#L375-377
function calculateRevision(str) {
    return crypto.createHash('md5').update(str).digest("hex");
}

/**
 * Launch Node-BLUE.
 *
 * @returns {Promise<void>}
 */
async function launch_blue() {

    // Default listen address.
    let blue_listen = "localhost:1880";

    // Check if Node-BLUE supplies a listen address.
    if (typeof(blue) != "undefined" && typeof(blue.listen) == "function") {
        blue_listen = await (await blue.listen).valueOf();
        red.log.info(`minired: Listening on ${blue_listen}`)
    }

    // Decode listen address, and invoke Node-RED.
    let http_host, http_port;
    [http_host, http_port] = blue_listen.split(":");
    await launch_red(Number.parseInt(http_port), http_host);
}


// Export symbols.
module.exports = {
    red: red,
    launch_blue: launch_blue,
}
