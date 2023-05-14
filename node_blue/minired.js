/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Copyright (c) 2023, The Panodata developers and contributors.
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
 * https://github.com/node-red/node-red/blob/master/packages/node_modules/node-red/red.js
 * https://github.com/oyajiDev/NodeRED.py/blob/master/noderedpy/node-red-starter/index.js
 *
**/

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


red.shutdown = function() {
    red.log.info("HTTP server: Shutting down");
    red_server.shutdown(async function(err) {
        if (err) {
            return red.log.info("HTTP server: Shutdown failed", err.message);
        }
        red.log.info("HTTP server: Shutdown completed");
        red.log.info("Node-RED: Shutting down");
        await red.stop();
        red.nodes.cleanModuleList();
        red.nodes.clearRegistry();
        red.log.info("Node-RED: Shutdown completed");
    });
}

async function run(http_host, http_port) {

    red.log.info("minired: Starting");

    let options = {
        // HTTP API is mountpoint.
        httpNodeRoot: "/",

        // Admin UI / Flow editor mountpoint.
        httpAdminRoot: "/admin",

        // Flow file to load.
        // It is `null`, because flows will be provided by Python.
        flowFile: null,

        // Filesystem location for instance metadata.
        userDir: "./var",

        // Configure editor theme and categories.
        //editorTheme: editorTheme,
        //paletteCategories: "",

        // Do those even exist?
        verbose: true,
        debug: true,
    };

    // Configure Node-RED context.
    red.init(red_server, options);

    // Node-RED default routes.
    express_app.use("/", express.static("web"));
    express_app.use(red.settings.httpAdminRoot, red.httpAdmin);
    express_app.use(red.settings.httpNodeRoot, red.httpNode);

    // Connect to Node-BLUE's flow provider.
    await connect_flow_provider();

    // Start Node-RED.
    red.start().then(() => {
        red.log.info("minired: Node-RED starting");
        red_server.listen(http_port, http_host, async () => {
            red.log.info(`minired: HTTP interface started on http://${http_host}:${http_port}`);
            // let active_flows = await red.runtime.flows.getFlows({});
            // console.log("Active flows:", active_flows);
        });
    });

}

/**
 * Connect Node-RED to Node-BLUE's flow provider.
 *
 * @returns {Promise<void>}
 */
async function connect_flow_provider() {
    red.log.info("minired: Connecting flow provider");

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
 * Compute digest to use as flow revision number.
 *
 * @param str
 * @returns {string}
 */
// https://gitlab.com/monogoto.io/node-red-contrib-flow-manager/-/blob/0.7.4/flow-manager.js#L375-377
function calculateRevision(str) {
    return crypto.createHash('md5').update(str).digest("hex");
}


// FIXME: Parameterize!
let http_host = "0.0.0.0";
let http_port = 1880;
await run(http_host, http_port);

return red;
