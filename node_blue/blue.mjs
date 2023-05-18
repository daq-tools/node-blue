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

// Import JavaScript <-> Python subsystem.
import python from "pythonia";
const py = python.py

// Import prerequisites.
import crypto from "crypto";
import express from "express";
import http from "http";
import http_shutdown from "http-shutdown";
import red from "node-red";

// Express and Node-RED application / server instances.
const express_app = express()
const base_server = http.createServer(express_app)
const red_server = http_shutdown(base_server)


/**
 * Main Node-BLUE application.
 */
class NodeBlueApplication {

    /**
     * Create NodeBlueJS instance, obtain settings.
     *
     * @param settings {Object}
     */
    constructor(settings) {
        this.settings = settings
    }

    async setup() {
        // Default listen address.
        const listen_address = this.settings.listen || "localhost:1880"
        console.log(`Node-BLUE: Listening on ${listen_address}`)

        // Decode listen address, and invoke Node-RED.
        let http_host, http_port
        [http_host, http_port] = listen_address.split(":")

        this.red_wrapper = new NodeRedWrapper(http_host, Number.parseInt(http_port))
        await this.red_wrapper.setup("./settings.js")

        // Register Node-BLUE's extension types.
        await this.register_types()

        // Connect Node-RED to Node-BLUE's flow provider.
        await this.connect_flow_provider()
    }

    /**
     * Launch Node-BLUE.
     *
     * @returns {Promise<void>}
     */
    async start() {
        red.log.info("Node-BLUE: Starting")
        return await this.red_wrapper.start()
    }

    /**
     * An improved Node-RED shutdown function.
     */
    async stop() {
        red.log.info("Node-BLUE: Stopping")
        return await this.red_wrapper.stop()
    }

    /**
     * Register Node-RED type extensions.
     *
     * @returns {Promise<void>}
     */
    async register_types() {
        red.log.info("Node-BLUE: Registering types")
        // TODO: `@node-loader/import-maps` does not work here.
        //       Will it be better after packaging `droste` as a real NPM?
        //       Otherwise, maybe refactor `blue.mjs` to ES6 module `blue.mjs`?
        // TODO: Improve after migration to ES6.
        const PythonFunctionNode = (await import("./udf_python.mjs")).PythonFunctionNode
        red.nodes.registerType("node-blue", "python-function", PythonFunctionNode)
    }

    /**
     * Connect Node-RED to Node-BLUE's flow provider.
     *
     * @returns {Promise<void>}
     */
    async connect_flow_provider() {
        red.log.info("Node-BLUE: Connecting flow provider")

        // Request flows from Node-BLUE (Python).
        // FIXME: Do not use global variables.
        let blue_flows = []
        if (typeof(blue_context) != "undefined" && typeof(blue_context.get_flows) == "function") {
            blue_flows = await (await blue_context.get_flows()).valueOf()
        }

        // Provide flows to Node-RED.
        // https://gitlab.com/monogoto.io/node-red-contrib-flow-manager/-/blob/0.7.4/flow-manager.js#L391-414
        red.runtime.storage.getFlows = async function () {
            const retVal = {
                flows: blue_flows,
                rev: calculateRevision(JSON.stringify(blue_flows)),
                // TODO: How to properly propagate `credentials`?
                credentials: {},
            }
            return retVal
        }
    }

}


/**
 * Node-RED wrapper.
 */
class NodeRedWrapper {

    constructor(http_host, http_port) {
        this.http_host = http_host
        this.http_port = http_port
    }

    async setup(path) {
        // Load Node-RED settings from file.
        const settings = await this.load_settings(path)

        // Configure Node-RED context.
        red.init(red_server, settings)
    }

    /**
     * Launch Node-RED.
     *
     * @param http_port
     * @param http_host
     * @returns {Promise<void>}
     */
    async start() {

        red.log.info("minired: Mounting HTTP routes")

        // Node-RED default routes.
        // TODO: Serve static `web` from directory within Python package.
        express_app.use("/", express.static("web"))
        express_app.use(red.settings.httpAdminRoot, red.httpAdmin)
        express_app.use(red.settings.httpNodeRoot, red.httpNode)

        // Start Node-RED.
        red.log.info(`minired: Starting HTTP admin interface at http://${this.http_host}:${this.http_port}${red.settings.httpAdminRoot}`)
        await red_server.listen(this.http_port, this.http_host)

        red.log.info("minired: Starting Node-RED")
        await red.start()
        red.log.info("minired: Node-RED started successfully")

        // let active_flows = await red.runtime.flows.getFlows({})
        // console.log("Active flows:", active_flows)

    }

    async stop() {
        const shutdown_task = new Promise((resolve, reject) => {

            // Shut down HTTP server.
            red.log.info("HTTP server: Shutting down")
            red_server.shutdown(async function(err) {
                if (err) {
                    red.log.info(`HTTP server: Shutdown failed. Reason: ${err}`)
                } else {
                    red.log.info("HTTP server: Shutdown completed")
                }

                // Shut down Node-RED.
                red.log.info("Node-RED: Shutting down")
                await red.stop()
                red.nodes.cleanModuleList()
                red.nodes.clearRegistry()

                // Report about shutdown.
                const isStarted = await red.runtime.isStarted()
                red.log.info(`Node-RED: Shutdown completed (started=${isStarted})`)
                // TODO: Add a more sensible return value here.
                //       Maybe some statistics information from the current context?
                resolve(42)
            })
        })
        return await shutdown_task
    }

    async load_settings(path) {
        try {
            const settings = (await import(path)).default
            // settings.settingsFile = path
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

}


/**
 * Compute digest to use as flow revision number.
 *
 * @param str
 * @returns {string}
 */
// https://gitlab.com/monogoto.io/node-red-contrib-flow-manager/-/blob/0.7.4/flow-manager.js#L375-377
function calculateRevision(str) {
    return crypto.createHash('md5').update(str).digest("hex")
}


// Export symbols.
export { NodeBlueApplication, red }
