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
import {PythonCodeBox} from "../droste/nodejs/python_api.mjs"

// TODO: Improve after migration to ES6.
// import { red } from "blue"
const blue = await import("./blue.js")
const red = blue.red


/**
 * Running Python user-defined functions in Node-RED.
 * The improved variant. Can do kwargs.
 *
 * @param config
 * @constructor
 */
export function PythonFunctionNode(config) {
    const realfunc = async function async(config) {

        red.nodes.createNode(this, config)
        const node = this

        console.log("node:", node.id)

        // Derive function name from node identifier.
        const funcname = id_to_funcname(node.id)

        // v1
        // let pyfun = await mkpyfun(config.func)

        // v2
        const box = await PythonCodeBox.init({verbose: true, pretty: true})
        await box.register(funcname, config.func)

        node.on("input", async function(msg, send, done) {

            // v1
            // let result = await pyfun({msg: msg, send: send, done: done})
            // console.log("pyfun-result:", result)

            // v2
            let retval = await box.invoke(funcname, {msg: msg, send: send, done: done})
            if (retval === undefined || retval === null) {
                done()
            } else {
                send(await retval.valueOf())
                done()
            }
        })

    }
    realfunc.apply(this, [config])
}


/**
 * Running Python user-defined functions in Node-RED.
 * The basic variant. Can't do kwargs.
 *
 * @param config
 * @constructor
 */
export function PythonFunctionNodeBasic(config) {
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


/**
 * Derive function name from node identifier.
 *
 * TODO: Some sort of `slugify` function will be appropriate.
 *       The current implementation is a bit thin.
 *       There are more characters which are not valid within function names.
 *
 * @param node_id {String}
 * @return {String}
 */
function id_to_funcname(node_id) {
    node_id = node_id.replace(".", "_")
    node_id = `f_${node_id}`
    return node_id
}
