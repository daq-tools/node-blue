/**
 * About
 * =====
 *
 * Run Python code from JavaScript, without any function signatures.
 * Canonical example for bringing Python user-defined functions to Node-RED.
 * This is the vanilla JavaScript variant.
 *
 * Synopsis
 * ========
 *
 *  time node droste/examples/js-basic-python.js
 */


// Import prerequisites, classic JavaScript style.
const { python } = require("pythonia")

// Because non-ES6 JavaScript does not offer compile-time imports on module level with Node.JS,
// it needs to resort to a dynamic import, which, in turn, only returns a Promise instance,
// which can't be resolved synchronously. That's a dilemma, but it could be worse. For now,
// `PythonCodeBox` is forward-defined here, and gets imported at runtime right away a few
// lines below.
// TODO: Maybe `deasync` or `synckit` could be used?
let PythonCodeBox


// Invoke program.
(async() => {
    // Dynamically import ES6 module.
    // TODO: `@node-loader/import-maps` does not work here.
    //       Will it be better after packaging `droste` as a real NPM?
    //       Otherwise, just prefer the ES6 variant!
    PythonCodeBox = (await import("../nodejs/python_api.mjs")).PythonCodeBox
    await Application.run()
})()


// The Python user-defined function to be executed.
let pycode = `
"""
Simple MQTT message transformation and topic rewriting rule for converting from
imperial to metric. Production-grade code would need better error handling.
"""

if msg.topic.endswith("imperial"):
  msg.payload.temperature = round((float(msg.payload.temperature) - 32) * 5 / 9, 2)
  msg.topic = msg.topic.replace("imperial", "metric")
  return msg
`.trim()


class Application {

    /**
     * Define workload example, without the boilerplate.
     *
     * Here, it defines an MQTT message, starts a Python interpreter context, compiles
     * a snippet of Python code, and invokes it, by feeding the MQTT message to it.
     * rewriting rule example recipe defined in `pycode`.
     *
     * TODO: Refactor into software test.
     *
     * @returns {Promise<*>}
     */
    static async workload() {
        let kwargs = {
            msg: {payload: {temperature: 42.42}, topic: "foo/imperial"},
            send: function() {},
            done: function() {},
        }

        const box = await PythonCodeBox.init({verbose: true, pretty: true})
        await box.register("testdrive", pycode)

        return await box.invoke("testdrive", kwargs)
    }

    /**
     * Run application program.
     *
     * @returns {Promise<*>}
     */
    static async run() {
        // await Util.sleep(300)
        await Util.setup_logging()
        const result = await this.workload()
        console.log("Result is:", result)
        python.exit()
        process.exit()
        // await Util.sleep(2000)
    }
}


class Util {

    static async info(message) {}

    // Boilerplate: Configure Python logger.
    static async setup_logging() {
        const node_blue_util = await python("node_blue.util")
        const setup_logging = await node_blue_util.setup_logging
        setup_logging()
    }

    // sleep() equivalent for vanilla Javascript using ES6 features.
    // https://gist.github.com/celsobessa/bd675278ae44a6edc1e2d308d7f742a5
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

}
