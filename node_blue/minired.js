/**
 * Copyright JS Foundation and other contributors, http://js.foundation
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
const express = require("express");
const http = require("http");
//const httpClose = require("http-close");
const red = require("node-red");

// Express and Node-RED application / server instances.
const express_app = express();
const base_server = http.createServer(express_app);

//httpClose({ timeout: 10 }, red_server);
const red_server = require("http-shutdown")(base_server);

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
        flowFile: "examples/flows/http-html-templating.json",

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

    // Start Node-RED.
    red.start().then(() => {
        red.log.info("minired: Node-RED starting");
        red_server.listen(http_port, http_host, () => {
            red.log.info(`minired: HTTP interface started on http://${http_host}:${http_port}`);
        });
    });

}

let http_host = "0.0.0.0";
let http_port = 1880;
await run(http_host, http_port);

return red;
