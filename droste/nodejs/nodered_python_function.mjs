/**
 * Node-BLUE PythonFunctionNode for writing Node-RED user-defined functions in Python.
 *
 * Copyright (c) 2023, The Panodata developers and contributors.
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

// TODO: Improve after migration to ES6.
// import { red } from "blue"
const blue = await import("../../node_blue/blue.js")
const red = blue.red

/**
 * Running Python user-defined functions in Node-RED.
 *
 * @param config
 * @constructor
 */
export function PythonFunctionNode(config) {
    const realfunc = async function async(config) {
        red.nodes.createNode(this, config)
        const node = this

        let pyfun = await mkpyfun(config.func)

        node.on("input", async function(msg, send, done) {
            let result = await pyfun({msg: msg, send: send, done: done})
            console.log("pyfun-result:", result)
            // let out = {topic: msg2.topic, payload: msg2.payload}
            // let out = await (await res.msg).valueOf()
        })

    }
    realfunc.apply(this, [config])
}
